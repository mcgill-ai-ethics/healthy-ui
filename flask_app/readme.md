# Database Setup
### Running Flask Project
```
python3 app.py
```

### Running MongoDB locally on Linux (Ubuntu)
1) Go to the following website and download the mongodb shell for your platform: 
https://www.mongodb.com/try/download/community

2) Extract and install your instance with: sudo dpkg -i [your_mongodb_shell_package]

3) Verify that everything is running by running the command in your terminal: mongosh

### Troubleshoot
- Verify your permission on the file: /tmp/mongodb-27017.sock
  You might to add/change its permission to mongodb using the 'chown' command



