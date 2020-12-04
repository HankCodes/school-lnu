/** 
 * Listens for voice commands.
 */
import { verb, target, attribute, value } from './commands.js'

const recognition = new webkitSpeechRecognition()
recognition.continuous = true
recognition.interimResults = true
recognition.lang = "en-US"
let lastRecording = ''

recognition.addEventListener('result', event => {
    lastRecording = event.results[event.results.length - 1]
    if (lastRecording.isFinal) {
        let text = lastRecording[0].transcript

        console.log('Catched a phrase...')
        console.log(text)
        
        text = text.toLowerCase()

        let foundVerb = ""
        let foundTarget = ""
        let foundAttribute = ""
        let foundValue = ""
        
        foundVerb = findVerb(text)
        foundTarget = find(target, text)
        foundAttribute = find(attribute, text)
        foundValue = find(value, text)
        
        if (foundAttribute === "") {
            foundAttribute = 'to'
        }
        
        if (foundVerb === 'logout') {
            foundTarget = 'logout'
            foundAttribute = 'logout'
            foundValue = 'logout'
            
        }
    
        console.log("verb: ", foundVerb)
        console.log("Target: ", foundTarget)
        console.log("Attribute: ", foundAttribute)
        console.log("Value: ", foundValue)
        
        if (isReadyToSend(foundVerb, foundTarget, foundAttribute, foundValue)) {
            window.location = `${window.location.href}?verb=${foundVerb}&target=${foundTarget}&attribute=${foundAttribute}&value=${foundValue}&command=send`
        }
    }
})

recognition.addEventListener('end', event => {
    console.log('recording has ended with following result: \n', lastRecording);
})



const findVerb = (text) => {
    let foundVerb = ""
    
    verb.change.forEach(currentVerb => {
        if (text.includes(currentVerb)) {
            foundVerb = 'change'
        }
    })
    
    if (foundVerb.length === 0) {
        verb.navigate.forEach(currentVerb => {
            if (text.includes(currentVerb)) {
                foundVerb = 'navigate'
            }
        })
    }
    
    if (foundVerb.length === 0) {
        verb.logOut.forEach(currentVerb => {
            if (text.includes(currentVerb)) {
                foundVerb = 'logout'
            }
        })
    }
    return foundVerb
}

const find = (toFind, text) => {
    let found = ""

    toFind.forEach(current => {
        if (text.includes(current)) {
            found = current
        }
    })

    return found
}

const isReadyToSend = (verb, target, attribute, value) => {
    if (verb.includes('navigate')) {
        // TODO implement navigation functionality
        console.log('Implemet navigation functionality')
    }
    
    return (verb.length > 1, target.length > 1, attribute.length > 1, value.length > 1)
}
recognition.start()



