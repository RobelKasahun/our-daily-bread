from app import create_app

app = create_app()

# run the app in debug mode
# run the app when the file is executed directly
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)