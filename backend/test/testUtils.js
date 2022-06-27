module.exports = {
    getEvent: (eventList, eventName) => {
        let ev
        eventList.forEach((item, _ix) => {
            if (item.event === eventName) {
                ev = item
            }
        })
        return ev
    },
    eventContainsArgument: (event, arg, expValue, converter) => {
        if (!event) {
            console.log('Null event')
            return false
        }
        try {
            return converter(event.args[arg]) === expValue
        } catch (error) {
            console.log(`Failed to convert ${event.args[arg]}`)
            return false
        }
    }
}