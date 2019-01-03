
const { Observable, Subject, from } = require('rxjs');
const { map, tap, filter, first, scan, switchMap} = require('rxjs/operators');







// --- create fake events from an array ---
// --- mash delay in between


const timer$ = Observable.interval(1000);
const eventsArray = [
                      'disconnect', 
                      'disconnect', 
                      'disconnect', 
                      'connect',
                      'disconnect', 
                      'disconnect', 
                      'disconnect', 
                      'disconnect',
                      'disconnect'
                    ];

const events$ = Observable.from(eventsArray);

const delayedEvents = Observable.zip(
  timer$,
  events$,
  (_, connectChangeEvent) => connectChangeEvent
);


// end dummy event creation














const maxRetries = 4;

const resetableCounter = function(predicate, countIncreasePeek, countResetPeek) {
    return function(count, currentValue){
      // count = predicate(currentValue) ? (count + 1) : 0;
        if(predicate(currentValue)){ // do the test function
          count = count + 1 // if true increase the counter
          countIncreasePeek(count); // run function
        } else {
          countResetPeek(); // run function
          count = 0; // if false reset the count to zero
        }
    return count;
    }    
};



const caughtDisconnect = function(count){ 
  console.log('disconnect caught: ' + count)  
}

const countReset = function(){ 
  console.log('counter Reset to zero')  
}


const example = delayedEvents.pipe(
  //tap(val => console.log(`Value ${val}`)),
	scan(
    resetableCounter(eventName => (eventName === 'disconnect'), caughtDisconnect, countReset)
    ,0 // start count
  ),
  filter(count => count === maxRetries), // ignore counts below max
  map( () => 'Max retries reached'), 
  first() // finish on first event
)


  example.subscribe(function(result) {
    // disconnect, give up! react as you please   
    console.log('finalresult: ' + result);
  }); 

/*
 const subscribe = example.subscribe({
    next(result) {
      // disconnect, give up! react as you please   
      console.log('result: ' + result);
    },
    error(err) { 
      console.log(err);
    },
    complete() {
      console.log('Done!');
    }
 });

*/

//dd