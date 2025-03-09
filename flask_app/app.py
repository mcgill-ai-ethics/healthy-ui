from flask import Flask, jsonify, request
from flask_cors import CORS

import os
import go_interface
import utils
import yt_transcript  
import keyword_ex
from services import video_service
from configuration import get_config

trk = keyword_ex.TextRankKeyword()

app = Flask(__name__)
app.config.from_object(get_config())

CORS(app, supports_credentials=True, origins=['*'])

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


#get video by id
# i.e if first time user opened the portal
@app.route("/api/video", methods=['GET'])
def get_videos_by_id():
    video_ids = request.args.get('ids')

    if video_ids is None:
        return jsonify(video_service.get_default_video_list()), 200

    video_ids, err, code = utils.assert_video_ids(video_ids)
    if err:
        return err, code 

    return jsonify(video_service.get_video_by_ids(video_ids)), 200

# @todo, keyword 'search' is not implemented
# for now send back random string of IDs
@app.route('/api/video/<keyword>')
def get_user_videos_playlist(keyword: str):
    print('being called')
    return jsonify(video_service.get_video_by_keyword_search(keyword))


# when user loads individual video,
# or we decide in the future that we need more complex lists
# use this route
# @app.route('/api/video/get-full-video-by-id', methods=['GET'])
# def get_full_user_video():
#     video_ids = request.args.get('ids')
#     video_ids, err, code = utils.assert_video_ids(video_ids)
#     if err:
#         return err, code
#     return jsonify(user_videos.get_user_full_video_service(video_ids))


# ROUTE: Go calls this concurrently to return transcripts for a list of videos
@app.route('/yt/transcript', methods=['GET'])
def get_yt_transcript():

    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400

    transcript, source = yt_transcript.get_transcript(video_id)
    return jsonify({'transcript': transcript, 'source': source})

# ROUTE: Go calls this concurrently to return relevant transcripts for a list of videos
@app.route('/yt/relevant-transcript', methods=['GET'])
def get_yt_rel_transcript():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400
    
    video_id = yt_transcript.extract_ids([video_id])

    transcript = yt_transcript.get_relevant_transcript(video_id, tolerance_sec=20, option="asc")
    return jsonify(transcript)

# ROUTE: Get video metadata for a list of videos
@app.route('/yt/video', methods=['GET'])
def youtube_metadata_cc(video_ids=None):
    if video_ids is None:
        video_ids = request.args.get('ids')
        video_ids, err, code = utils.assert_video_ids(video_ids)
        if err:
            return err, code

    video_ids = yt_transcript.extract_ids(video_ids)
    res = go_interface.youtube_cc(video_ids)
    return jsonify(res)

# ROUTE: Get transcripts and most replayed timestamps concurrently for a list of videos
@app.route('/yt/tr-mr', methods=['GET'])
def youtube_transcript_most_replayed_cc(video_ids=None):   
    if video_ids is None:
        video_ids = request.args.get('ids')
        video_ids, err, code = utils.assert_video_ids(video_ids)
        if err:
            return err, code

    video_ids = yt_transcript.extract_ids(video_ids)
    res = go_interface.youtube_transcript_most_replayed_cc(video_ids)
    return jsonify(res)

# ROUTE: Get relevant transcripts for a list of videos concurrently
@app.route('/yt/rtr', methods=['GET'])
def youtube_relevant_transcript_cc(video_ids=None):
    if video_ids is None:
        video_ids = request.args.get('ids')
        video_ids, err, code = utils.assert_video_ids(video_ids)
        if err:
            return err, code

    video_ids = yt_transcript.extract_ids(video_ids)
    res = go_interface.youtube_relevant_transcript_cc(video_ids)
    return jsonify(res)

# ROUTE: Get keywords and keyphrases, query strings from youtube relevant transcripts
@app.route('/yt/tr-kw', methods=['GET'])
def youtube_transcript_keywords(video_ids=None):
    if video_ids is None:
        video_ids = request.args.get('ids')
        video_ids, err, code = utils.assert_video_ids(video_ids)
        if err:
            return err, code
    
    video_ids = yt_transcript.extract_ids(video_ids)

    transcripts = yt_transcript.get_relevant_transcript(video_ids)

    if transcripts == {}:
        return jsonify({'error': 'No transcripts found'})


    json_results = {}
    for video_id in transcripts:
        text = transcripts[video_id]['text']

        if text is None:
            json_results[video_id] = {
                "query_strings": [],
                "keywords": [],
                "keyphrases": []
            }
            continue
        
        trk.analyze(text, candidate_pos = ['NOUN', 'PROPN'], window_size=4, lower=False)
        keywords = trk.get_keywords(10)
        keyphrases = trk.yake_phrasing(text)
        dict_keyphrases = {k[0]: k[1] for k in keyphrases}
    
        # How many queries to generate, and how many keywords per query
        query_strings = trk.generate_query_strings(keywords, num_q=3, keywords_per_q=3)

        query_strings = list(query_strings)

        json_results[video_id] = {
            "query_strings": query_strings,
            "keywords": keywords,
            "keyphrases": dict_keyphrases
        }          

    return jsonify(json_results)


# ROUTE: Get best combination of keywords from youtube metadata (title, desc) + relevant transcripts 
@app.route('/yt/b-kw', methods=['GET'])
def youtube_blob_keywords(video_ids=None):
    video_ids = ""
    if video_ids is None:
        video_ids = request.args.get('ids')
        video_ids, err, code = utils.assert_video_ids(video_ids)
        if err:
            return err, code
    
    return video_service.get_youtube_blob_keywords(video_ids)

# ROUTE: Get related news articles for a list of videos
@app.route('/yt/news', methods=['GET'])
def youtube_news(video_ids=None):
    video_ids = request.args.get('ids')
    video_ids, err, code = utils.assert_video_ids(video_ids)
    if err:
        return err, code

    res = video_service.get_youtube_blob_keywords(video_ids)


    json_results = {}
    for video_id in res:
        queries = res[video_id]["query_strings"]
        print(f"queries: {queries}")

        queries = utils.strings_to_bytes(queries) 
        headlines = go_interface.news_api_cc(queries)
        queries =  utils.bytes_to_strings(queries)
        

        json_results[video_id] = {
            "query_strings": queries,
            "headlines": headlines,
        }

    return jsonify(json_results)


# ROUTE: Get fact checked related articles for a list of videos
@app.route('/yt/fc', methods=['GET'])
def youtube_fc(video_ids=None):
    if video_ids is None:
        video_ids = request.args.get('ids')
        video_ids, err, code = utils.assert_video_ids(video_ids)
        if err:
            return err, code

    res = video_service.get_youtube_blob_keywords(video_ids)


    json_results = {}
    for video_id in res:
        queries = res[video_id]["query_strings"]

        queries = utils.strings_to_bytes(queries) 
        fact_checks = go_interface.fact_check_cc(queries)
        queries =  utils.bytes_to_strings(queries)

        assert fact_checks is not None, "fact_checks is None is route /yt/fc"

        video_fc = {}
        has_claims = False
        for query in queries:
            print("query:", query)
            if fact_checks[query]['claims'] and fact_checks[query]['number_of_claims'] > 0:
                print(fact_checks[query]['number_of_claims'])
                video_fc[query] = fact_checks[query]
                has_claims = True

            if has_claims:
                print(f"{query} has claims")
                
                json_results[video_id] = {
                    "query_strings": queries,
                    "fact_checks": video_fc,
                }

    return jsonify(json_results)


# ROUTE: Get fc and news related articles for a list of videos
@app.route('/yt/fc-news', methods=['GET'])
def youtube_fc_news(video_ids=None):
    if video_ids is None:
        video_ids = request.args.get('ids')
        video_ids, err, code = utils.assert_video_ids(video_ids)
        if err:
            return err, code

    res = video_service.get_youtube_blob_keywords(video_ids)

    json_results = {}
    for video_id in res:
        queries = res[video_id]["query_strings"]

        queries = utils.strings_to_bytes(queries) 
        fact_checks = go_interface.fact_check_cc(queries)
        news = go_interface.news_api_cc(queries)
        queries =  utils.bytes_to_strings(queries)
        
        json_results[video_id] = {
            "query_strings": queries,
            "fact_checks": fact_checks,
            "news": news,
        }

    return jsonify(json_results)


# ROUTE: Get fact checked results for a list of queries
@app.route('/fc', methods=['GET'])
def fact_check_cc(queries=None):
    if queries is None:
        queries = request.args.get('queries')   
        if not queries:
            return jsonify({'error': 'Missing queries parameter'}), 400
        queries = queries.split(',') if ',' in queries else [queries]

    queries = utils.strings_to_bytes(queries)
    res = go_interface.fact_check_cc(queries)
    return jsonify(res)

# ROUTE: Get news headlines for a list of queries
@app.route('/news', methods=['GET'])
def news_api_cc(queries=None):
    if queries is None:
        queries = request.args.get('queries')   
        if not queries:
            return jsonify({'error': 'Missing queries parameter'}), 400
        queries = queries.split(',') if ',' in queries else [queries]

    queries = utils.strings_to_bytes(queries)
    res = go_interface.news_api_cc(queries)
    return jsonify(res)

@app.route('/', methods=['GET'])
def hello_world():
    return "Welcome to the flask backend"
    
if __name__ == '__main__':
    # note port is a reserved env variable in platform SH
    # @todo consolidate PORT + BACKEND_PORT
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', "0.0.0.0")
    app.run(debug=False, host=host, port=port)
