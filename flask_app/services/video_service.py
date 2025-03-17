from pprint import pprint
from typing import TypedDict
from faker import Factory
import keyword_ex

import go_interface
import yt_transcript

fake = Factory.create()

from go_interface import youtube_cc

youtube_ids = [
    b'74kHGCBHvDc',
    b'8RVooYlyl20',
    b'Cx3tIR7C-pM',
    b'ImSlcxvDz4Q',
    b'M1u1ECx_Nlw',
    b'UE6QxBaIEv8',
    b'bNH16A4f5Yk',
    b'kZ-kK6mJRKM',
    b'X2tzjK_-mko',
    b'k357uIJzcr0',
]

trk = keyword_ex.TextRankKeyword()

# @todo these are out of date now as we made resp closer to youtube API
class VideoMeta(TypedDict):
    spectrum_calc: float
    placeholder: str
    title: str
    description: str


# @todo these are out of date now as we made resp closer to youtube API
class VideoInfo(TypedDict):
    id: str
    title: str
    thumbnail: str
    channel_thumbnail: str
    author: str
    views: str
    date: str
    meta: VideoMeta


#########################################################
#
#########################################################
def simplify_youtube_data(data):
    simplified_videos = []

    for video_id in data.values():
        for item in video_id['items']:
            video_data = {
                'id': item['id'],
                'statistics': item['statistics'],
                'snippet': item['snippet'],
                'topicDetails': item['topicDetails'],
                # keep this for now, they are just for demo purposes
                # but most likely tehy will be resplaces by independent API
                # calls and data types
                # it's just to illustrate that our data type
                # doesn't necessarily match the one coming back from youtube
                'huiMeta': {
                    'title': fake.text(max_nb_chars=20),
                    'spectrum_calc': fake.random_int(min=0, max=10) / 10,
                    'placeholder': fake.text(max_nb_chars=100),
                    'description': fake.text(max_nb_chars=250)
                }
            }
            simplified_videos.append(video_data)

    return simplified_videos


# if no ids defined
def get_default_video_list():
    temp_ids = youtube_ids
    res = youtube_cc(temp_ids)
    formatted_data = simplify_youtube_data(res)
    return formatted_data


# placeholder / stubb
def get_video_by_keyword_search(keyword: str):
    temp_ids = youtube_ids
    res = youtube_cc(temp_ids)
    formatted_data = simplify_youtube_data(res)
    return formatted_data


def get_video_by_ids(video_ids: list[str]|None):
    extracted_video_ids = yt_transcript.extract_ids(video_ids)
    res = youtube_cc(extracted_video_ids)
    formatted_data = simplify_youtube_data(res)
    return formatted_data

def get_youtube_blob_keywords(video_ids):
    video_ids = yt_transcript.extract_ids(video_ids)
    vid_data = go_interface.youtube_cc(video_ids)
    transcripts = yt_transcript.get_relevant_transcript(video_ids)
    print("here")#test
    
    json_results = {}
    if not vid_data:
        return json_results

    for video_id in vid_data:
        title = vid_data[video_id]["items"][0]["snippet"]["title"]
        description = vid_data[video_id]["items"][0]["snippet"]["description"]
        if transcripts[video_id]['text'] is not None:
            transcript = transcripts[video_id]['text']
            blob = title + description + transcript
            t_used = True
        else:
            blob = title + description
            t_used = False

        trk.analyze(blob, candidate_pos = ['NOUN', 'PROPN'], window_size=4, lower=False)
        keywords = trk.get_keywords(10)
        print("keyword: ", keywords)
        
        tags = vid_data[video_id]["items"][0]["snippet"]["tags"]

        best_keywords = {}
        dict_keyphrases = {}
        if tags is not None:
            for keyword, score in keywords.items():
                closest = trk.closest_keyword2(keyword, tags)
                if closest is None:
                    best_keywords[keyword] = score
                else:
                    # replace keyword with closest keyword
                    for c, s in closest.items():
                        best_keywords[c] = score * s
                if closest is None:
                    # No similar keywords between tags and TextRank keywords
                    keyphrases = trk.yake_phrasing(blob)
                    dict_keyphrases = {k[0]: k[1] for k in keyphrases[:5]} # limit to 5 keyphrases
                    for keyphrase, score in dict_keyphrases.items():
                        closest = trk.closest_keyword2(keyphrase, tags)
                        if closest is None:
                            best_keywords[keyphrase] = score
                        else:
                            # replace keyword with closest keyword
                            for c, s in closest.items():
                                best_keywords[c] = score * s
            
        # How many queries to generate, and how many keywords per query
        query_strings = trk.generate_query_strings(best_keywords, num_q=3, keywords_per_q=2)
        query_strings = list(query_strings)

        json_results[video_id] = {
            "query_strings": query_strings,
            "keyphrases": dict_keyphrases,
            "best_keywords": best_keywords,
            "tags": tags,
            "keywords": keywords, 
            "transcript_used": t_used
            }

    return json_results

