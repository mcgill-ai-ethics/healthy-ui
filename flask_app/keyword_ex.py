from collections import OrderedDict
import numpy as np
import spacy
import time
from spacy.lang.en.stop_words import STOP_WORDS
import utils
import subprocess
import json
import random
from itertools import islice
import yake
import difflib


from data import news_outlet_stop_words
# https://readmedium.com/en/https:/towardsdatascience.com/textrank-for-keyword-extraction-by-python-c0bae21bcec0

nlp = spacy.load('en_core_web_sm')
news_outlet_stop_words = news_outlet_stop_words.get_news_outlet_stop_list()

class TextRankKeyword():
    """Extract keywords from text"""
    
    def __init__(self):
        self.d = 0.85 # damping coefficient, usually is .85
        self.min_diff = 1e-5 # convergence threshold
        self.steps = 10 # iteration steps
        self.node_weight = None # save keywords and its weight
        self.set_stopwords()
        self.yake = yake.KeywordExtractor()

    def yake_phrasing(self,text):
        keyphrases = self.yake.extract_keywords(text)
        return keyphrases

    def set_stopwords(self, stopwords=[" ", ","]):  
        """Set stop words"""
        for word in STOP_WORDS.union(set(stopwords)):
            lexeme = nlp.vocab[word]
            lexeme.is_stop = True
    
    def sentence_segment(self, doc, candidate_pos, lower):
        """Store those words only in cadidate_pos"""
        sentences = []
        for sent in doc.sents:
            selected_words = []
            i = 0
            while i < len(sent):
                token = sent[i]

                # skip stopwords and punctuation
                if token.is_stop or token.is_punct or not str(token).isalpha() or str(token) in news_outlet_stop_words: 
                    i += 1
                    continue
                # named entity recognition NER
                if token.ent_type_ and token.is_stop is False:
                    ent = doc[token.i:token.i+len(token.ent_iob_)]
                    # ent_text = ' '.join([t.text for t in sent[i:i+len(token.ent_iob_)]]) 
                    ent_text = ' '.join([t.text for t in ent])
                    selected_words.append(ent_text.lower() if lower else ent_text)
                    i += len(token.ent_iob_)

                # check for noun phrasse
                elif token.pos_ == 'NOUN' and i + 1 < len(sent) and sent[i+1].pos_ in ['ADJ', 'NOUN', 'PROPN'] and token.is_stop is False:
                    noun_phrase = token.text + " " + sent[i+1].text
                    selected_words.append(noun_phrase.lower() if lower else noun_phrase)
                    i += 2
                
                # Single words
                elif token.pos_ in candidate_pos and token.is_stop is False:
                    selected_words.append(token.text.lower() if lower else token.text)
                    i += 1
                else:
                    i += 1
                    
            sentences.append(selected_words)
        return sentences
        
    def get_vocab(self, sentences):
        """Get all tokens"""
        vocab = OrderedDict()
        i = 0
        for sentence in sentences:
            for word in sentence:
                if word not in vocab:
                    vocab[word] = i
                    i += 1
        return vocab
    
    def get_token_pairs(self, window_size, sentences):
        """Build token_pairs from windows in sentences"""
        token_pairs = list()
        for sentence in sentences:
            for i, word in enumerate(sentence):
                for j in range(i+1, i+window_size):
                    if j >= len(sentence):
                        break
                    pair = (word, sentence[j])
                    if pair not in token_pairs:
                        token_pairs.append(pair)
        return token_pairs
        
    def symmetrize(self, a):
        return a + a.T - np.diag(a.diagonal())
    
    def get_matrix(self, vocab, token_pairs):
        """Get normalized matrix"""
        # Build matrix
        vocab_size = len(vocab)
        g = np.zeros((vocab_size, vocab_size), dtype='float')
        for word1, word2 in token_pairs:
            i, j = vocab[word1], vocab[word2]
            g[i][j] = 1
            
        # Get Symmeric matrix
        g = self.symmetrize(g)
        
        # Normalize matrix by column
        norm = np.sum(g, axis=0)
        g_norm = np.divide(g, norm, where=norm!=0) # this is ignore the 0 element in norm
        
        return g_norm

    
    def get_keywords(self, number=10):
        """return top number keywords"""
        node_weight = OrderedDict(sorted(self.node_weight.items(), key=lambda t: t[1], reverse=True))
        top_keywords = dict(islice(node_weight.items(), number))
        for key, value in top_keywords.items():
            print(f"{key} - {value}")
        return top_keywords
        
        
    def analyze(self, text, 
                candidate_pos=['NOUN', 'PROPN'], 
                window_size=4, lower=False, stopwords=list()):
        """Main function to analyze text"""
        
        
        # Pare text by spaCy
        doc = nlp(text)
        
        # Filter sentences
        sentences = self.sentence_segment(doc, candidate_pos, lower) # list of list of words
        
        # Build vocabulary
        vocab = self.get_vocab(sentences)
        
        # Get token_pairs from windows
        token_pairs = self.get_token_pairs(window_size, sentences)
        
        # Get normalized matrix
        g = self.get_matrix(vocab, token_pairs)
        
        # Initionlization for weight(pagerank value)
        pr = np.array([1] * len(vocab))
        
        # Iteration
        previous_pr = 0
        for epoch in range(self.steps):
            pr = (1-self.d) + self.d * np.dot(g, pr)
            if abs(previous_pr - sum(pr))  < self.min_diff:
                break
            else:
                previous_pr = sum(pr)

        # Get weight for each node
        node_weight = {word: pr[index] for word, index in vocab.items()}
        self.node_weight = node_weight

    def generate_query_strings(self, keywords, num_q=3, keywords_per_q=5):
        query_strings = []
        keyword_items = list(keywords.items())
        print("keywords_items: ",keyword_items)

        for q in range(num_q):
            chosen_keywords = []

            if len(keyword_items) > 0:
                if len(keyword_items) < keywords_per_q:
                    print("Not enough keywords for unique sampling, using sampling with repeat")
                    chosen_keywords = random.choices(keyword_items, k=3)
                else:
                    print("Enough keywords for unique sampling")
                    chosen_keywords = random.sample(keyword_items, keywords_per_q) # random.sample for uniqueness

            # Reorder based on original keywords order
            chosen_keywords.sort(key=lambda x: x[1], reverse=True)
            print(f"Query { + 1} keywords: {chosen_keywords}")

            query_str = ' '.join(keyword for keyword, _ in chosen_keywords)
            query_strings.append(query_str)
            print(f"Query {q + 1} string:", query_str)

        return query_strings    
            
    def closest_keyword2(self, target_keyword, keywords, cutoff=0.45):
        closest = difflib.get_close_matches(target_keyword, keywords, n = 3, cutoff=cutoff)
        if len(closest) == 0:
            print(f"No closest keyword found for {target_keyword}")
            return None
        else:
            print(f"Closest keywords for {target_keyword}: {closest}")
        closest_dict = {}
        similarities = [difflib.SequenceMatcher(None, target_keyword, match).ratio() for match in closest]
        for c in closest:
            closest_dict[c] = similarities[closest.index(c)]
            
        return closest_dict
