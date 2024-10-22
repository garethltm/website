from datetime import date
import speech_recognition as sr
import pyttsx3
import webbrowser
import wikipedia
import wolframalpha

#initialize pyttsx3
engine = pyttsx3.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id) # male voice;0 , female voice;1
activationWord = 'gareth'

#configure browser; set path to your browser
firefox_path = r'/Applications/Firefox.app %s'
webbrowser.register('firefox', None, webbrowser.BackgroundBrowser(firefox_path))


#function to speak
def speak(text, rate = 150):
    engine.setProperty('rate', rate)
    engine.say(text)
    engine.runAndWait()
    
#function to greet the user
def parseCommand():
    listener = sr.Recognizer()
    print('Listening...')
    
    with sr.Microphone() as source:
        listener.pause_threshold = 2
        input_speech = listener.listen(source)
        
    try:
        print('Recognizing...')
        command = listener.recognize_google(input_speech, language='en-gb')
        print(f'User said: {command}')
    except Exception as e:
        print('Please repeat that again...')
        speak('Please repeat that again...')
        print(e)
        return 'None'
    
    return command

#search wikipedia
def search_wikipedia(query):
    searchResults = wikipedia.search(query)
    if not searchResults:
        print('No results found from Wikipedia')
        return 'No results found from Wikipedia'
    try:
        page = wikipedia.page(searchResults[0])
        print(page.content)
        return page.content
    except wikipedia.DisambiguationError as error:
        wikiPage = wikipedia.page(error.options[0])
    print(wikiPage.title)
    wikiSummary = str(wikiPage.summary)
    return wikiSummary

#main loop function
if __name__ == '__main__':
    speak('Hello, I am your personal assistant. How can I help you?')
    
    while True:
        #parse the command
        command = parseCommand().lower().split()
        
        if command[0] == activationWord:
            command.pop(0)
            
            #list of commands
            if command[0] == 'say':
                if 'hello' in command:
                    speak('Hello, how can I help you?')
                else:
                    command.pop(0) #remove the commanded word
                    speech = ' '.join(command) #convert list to string
                    speak(speech)
                    
            #navigate to a website
            if query[0] == 'go' and query[1] == 'to':
                speak('Opening the website...')
                query = ' '.join(query[2:])
                webbrowser.get('firefox').open_new(query)

            #wikipedia
            if query[0] == 'wikipedia':
                query = ' '.join(query[1:])
                speak('Searching Wikipedia...')
                speak(search_wikipedia(query))
                
            #calculate
            
                    