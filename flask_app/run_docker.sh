#!/bin/bash

if [ "$ENV" = "PROD" ]; then
  echo "Starting backend in production mode"
  gunicorn -w 3 --bind 0.0.0.0:$PORT wsgi:app
elif [ "$ENV" = "DEV" ]; then
  echo "Starting backend in development mode"
  python app.py
else
  echo "Unkown mode $ENV, running development mode instead"
  python app.py
fi
