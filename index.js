"use strict"


function only(appkit, args) {
  var dynotypes=[]
  dynotypes=args.TYPES.split(",")
  var payload=[]
  for(let i=0; i < dynotypes.length; i++) {
     payload.push({type:dynotypes[i], quantity:args.quantity})
  }

  let task = appkit.terminal.task(`Scaling **⬢ ${args.app}** ${args.TYPES} processes`);
  task.start();
    appkit.api.patch(JSON.stringify(payload), `/apps/${args.app}/formation`, (err, data) => {
      if(err) {
        task.end('error');
        appkit.terminal.error(err);
      } else {
        task.end('ok');
      }
    });
}

function except(appkit, args) {
  var dynotypes=[]
  dynotypes=args.TYPES.split(",")
  var payload=[]
  var existing=[]
 appkit.api.get('/apps/' + args.app + '/formation', (err, formations) => {
    if(err) {
      return appkit.terminal.error(err);
   }
   for(let i=0; i < formations.length; i++) { 
       existing.push(formations[i].type)
   }
  var filteredArray = existing.filter(function(x) { 
  return dynotypes.indexOf(x) < 0;
   });  
  for(let j=0; j < filteredArray.length; j++) {
     payload.push({type:filteredArray[j], quantity:args.quantity})
   }
  let task = appkit.terminal.task(`Scaling **⬢ ${args.app}** ${args.TYPES} processes`);
  task.start();
    appkit.api.patch(JSON.stringify(payload), `/apps/${args.app}/formation`, (err, data) => {
      if(err) {
        task.end('error');
        appkit.terminal.error(err);
      } else {
        task.end('ok');
      }
    });
  })

}

function all(appkit, args) {
  var payload=[]
 appkit.api.get('/apps/' + args.app + '/formation', (err, formations) => {
    if(err) {
      return appkit.terminal.error(err);
   }
   for(let i=0; i < formations.length; i++) {
       payload.push({type:formations[i].type, quantity:args.quantity})
   }
  let task = appkit.terminal.task(`Scaling all **⬢ ${args.app}**  processes`);
  task.start();
    appkit.api.patch(JSON.stringify(payload), `/apps/${args.app}/formation`, (err, data) => {
      if(err) {
        task.end('error');
        appkit.terminal.error(err);
      } else {
        task.end('ok');
      }
    });
  })

}




function update() {
}

function init(appkit) {
  appkit.args
    .command('multiscale:only TYPES', 'scale some dyno types.  TYPES is a comma delimited list', multiscale_opts, only.bind(null, appkit))
    .command('multiscale:except TYPES', 'scale dyno type except.  TYPES is a comman delimited list', multiscale_opts, except.bind(null, appkit))
    .command('multiscale:all', 'scale all dyno types', multiscale_opts, all.bind(null, appkit))
}

module.exports = {
  init:init,
  update:update,
  group:'mypluginname',
  help:'manage mypluginname (create, list)',
  primary:true
};


    const multiscale_opts = {
        app: {
            alias: 'a',
            string: true,
            description: 'app to act on',
            demand: true
        },
        quantity: {
            alias: 'q',
            int: true,
            description: 'quantity',
            demand: true
        },
    }
