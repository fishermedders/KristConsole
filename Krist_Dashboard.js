#!/usr/bin/env node
//testing sumn
var blessed = require('blessed')
  , contrib = require('blessed-contrib')

var setTerminalTitle = require('set-terminal-title');
setTerminalTitle('KRIST CONSOLE :D', { verbose: false });

var open = require('open');

var packageJson = require('./package.json');

var WebSocketClient = require('websocket').client;
const axios = require('axios')

const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;

var screen = blessed.screen()

//create layout and widgets

var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})

var tree =  grid.set(0, 8, 6, 4, contrib.tree, 
  { fg: 'green'
  , selectedFg: 'green'
  , label: 'Top {bold}{green-fg}B{/green-fg}{/bold}alances ({bold}{green-fg}R{/green-fg}{/bold} to reload)'
  , template: {lines:true}
  , tags: true
  }
);

tree.on('select',function(node){
    if (node.link){
        open(node.link);
    }
    //log.log(node.name);
    //screen.render();
});

var currentWorkLine = grid.set(0, 0, 6, 4, contrib.line, 
          { showNthLabel: 5
//          , maxY: 100
          , label: 'Current Work'
          , showLegend: false
          , legend: {width: 10}})

currentWorkLine.set
var twentyfourhWorkLine = grid.set(0, 4, 6, 4, contrib.line, 
            { showNthLabel: 5
//            , maxY: 100
            , label: '24h Work'
            , showLegend: false
            , legend: {width: 10}})

var globalStats = grid.set(6, 0, 3, 6, blessed.box, {label: 'Krist {bold}{green-fg}G{/green-fg}{/bold}lobal Stats', tags:true})
var latestStats = grid.set(9, 0, 3, 4, blessed.box, {label: 'Krist {bold}{green-fg}L{/green-fg}{/bold}atest Stats', tags:true})
var kristLogo = grid.set(9, 4, 3, 2, blessed.box, {tags:true, content:
    "{center}" + 
    "{white-bg}{green-fg}  //{/white-bg}{/green-fg}{green-fg}{#bfff00-bg}\\\\  {/#bfff00-bg}\n" +
    "{white-bg}{green-fg}//  {/white-bg}{/green-fg}{green-fg}{#bfff00-bg}  \\\\{/#bfff00-bg}\n" +
    "{green-fg}{#bfff00-bg}\\\\  {/green-fg}{/#bfff00-bg}{green-bg}{#bfff00-fg}  //{/green-bg}\n" +
    "{green-fg}{#bfff00-bg}  \\\\{/green-fg}{/#bfff00-bg}{green-bg}{#bfff00-fg}//  {/green-bg}\n" +
    "KristConsole v" + packageJson.version + "\n" +
    "by Fisher (@fishermedders){/center}"
})

var log = grid.set(6, 6, 6, 6, contrib.log, 
  { fg: "green"
  , selectedFg: "green"
  , label: 'Krist Node Events'})


//dummy data
var servers = ['US1', 'US2', 'EU1', 'AU1', 'AS1', 'JP1']
var commands = ['grep', 'node', 'java', 'timer', '~/ls -l', 'netns', 'watchdog', 'gulp', 'tar -xvf', 'awk', 'npm install']

//set dummy data for table
function generateTable() {
    axios.get('https://krist.ceriat.net/addresses/rich')
    .then((response) => {
      //console.log(response.data);
      var rich = { extended: true
        , children: {}};
      var count = 1;
      response.data.addresses.forEach((address) => {
          rich.children["#" + count + (count < 10 ? " " : "") + " {bold}" + address.address + "{/bold} {green-fg}₭" + Number(address.balance).toLocaleString() + "{/green-fg}"] = { children:
            { 'Address': { name: "Address: " + address.address}
            , 'Balance': { name: "Balance: {green-fg}₭" + Number(address.balance).toLocaleString() + "{/green-fg}"}
            , 'TotalIn': { name: "Total In: {green-fg}₭" + Number(address.totalin).toLocaleString() + "{/green-fg}"}
            , 'TotalOut': { name: "Total Out: {green-fg}₭" + Number(address.totalout).toLocaleString() + "{/green-fg}"}
            , 'FirstSeen': { name: "First Seen: " + address.firstseen}
            , 'Link': {name: " * Open in Krist.club", link: "https://krist.club/address/" + address.address}
          }};
          count++;
      });
      tree.setData(rich);
    });
}

generateTable()
tree.focus()
//setInterval(generateTable, 10000)


//set log dummy data
/*setInterval(function() {
   var rnd = Math.round(Math.random()*2)
   if (rnd==0) log.log('starting process ' + commands[Math.round(Math.random()*(commands.length-1))])   
   else if (rnd==1) log.log('terminating server ' + servers[Math.round(Math.random()*(servers.length-1))])
   else if (rnd==2) log.log('avg. wait time ' + Math.random().toFixed(2))
   screen.render()
}, 500)*/

//set map dummy markers
setInterval(function() {
   axios.get('https://krist.ceriat.net/supply')
    .then((supplydata) => {
        axios.get('https://krist.ceriat.net/work/day')
        .then((workday) => {
            axios.get('https://krist.ceriat.net/work')
            .then((currentwork) => {
                globalStats.setContent("{center}{grey-fg}Money Supply: {green-fg}₭{white-fg}" + Number(supplydata.data.money_supply).toLocaleString() + "{/center}\n{center}{grey-fg}24h Work Avg:{white-fg} ~" + Math.floor(average(workday.data.work)).toLocaleString() + "{/center}\n{center}{grey-fg}Current Work: {white-fg}" + Number(currentwork.data.work).toLocaleString() + "{/center}")
            });
        });
    });
   screen.render()
}, 1000)

//set line charts dummy data

var currentWorkData = {
   title: 'Current',
   style: {line: 'yellow'},
   //x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30', '01:40', '01:50', '02:00', '02:10', '02:20', '02:30', '02:40', '02:50', '03:00', '03:10', '03:20', '03:30', '03:40', '03:50', '04:00', '04:10', '04:20', '04:30'],
   x: [],
   //y: [0, 20, 40, 45, 45, 50, 55, 70, 65, 58, 50, 55, 60, 65, 70, 80, 70, 50, 40, 50, 60, 70, 82, 88, 89, 89, 89, 80, 72, 70]
   y: []
}

var twentyfourhData = {
   title: '24h work',
   style: {line: 'yellow'},
   //x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30', '01:40', '01:50', '02:00', '02:10', '02:20', '02:30', '02:40', '02:50', '03:00', '03:10', '03:20', '03:30', '03:40', '03:50', '04:00', '04:10', '04:20', '04:30'],
   x: [],
   //y: [0, 5, 5, 10, 10, 15, 20, 30, 25, 30, 30, 20, 20, 30, 30, 20, 15, 15, 19, 25, 30, 25, 25, 20, 25, 30, 35, 35, 30, 30]
   y: []
}

for (var workint=30;workint > 0;workint--) {
  currentWorkData.x.push('-' + workint + 'm');
}

for (var workint=24;workint > 0;workint--) {
  twentyfourhData.x.push('-' + workint + 'h');
}

function fetch24Work() {
  axios.get('https://krist.ceriat.net/work/day')
  .then((twentyfourwork) => {
      currentWorkData.y = twentyfourwork.data.work.slice(Math.max(twentyfourwork.data.work.length - 30, 0));
      twentyfourhData.y = twentyfourwork.data.work.filter(function(value, index, Arr) {
        return index % 61 == 0;
      });
      //console.log(newArr.length);
      //console.log(" " + newArr.length);
      currentWorkLine.setData(currentWorkData);
      twentyfourhWorkLine.setData(twentyfourhData);
  });  
}
fetch24Work();
setInterval(function() {
  fetch24Work();
}, 60000)

setLineData([currentWorkData], currentWorkLine)
setLineData([twentyfourhData], twentyfourhWorkLine)

setInterval(function() {
   //setLineData([currentWorkData], currentWorkLine)
   currentWorkLine.setData(currentWorkData);
   twentyfourhWorkLine.setData(twentyfourhData);
   screen.render()
}, 500)

function setLineData(mockData, line) {
  for (var i=0; i<mockData.length; i++) {
    var last = mockData[i].y[mockData[i].y.length-1]
    mockData[i].y.shift()
    var num = Math.max(last + Math.round(Math.random()*10) - 5, 10)    
    mockData[i].y.push(num)  
  }
  
  line.setData(mockData)
}


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key(['R','r'], function(ch, key) {
    log.log("↻ Refreshing Top Balances...")
    screen.render();
    generateTable();
});

screen.key(['b'], function(ch, key) {
    tree.focus()
    screen.render();
});

screen.key(['g'], function(ch, key) {
    globalStats.focus();
    screen.render();
});

// fixes https://github.com/yaronn/blessed-contrib/issues/10
screen.on('resize', function() {
  //donut.emit('attach');
  //gauge.emit('attach');
  //gauge_two.emit('attach');
  //sparkline.emit('attach');
  //bar.emit('attach');
  //table.emit('attach');
  //lcdLineOne.emit('attach');
  //errorsLine.emit('attach');
  tree.emit('attach');
  currentWorkLine.emit('attach');
  twentyfourhWorkLine.emit('attach')
  globalStats.emit('attach');
  latestStats.emit('attach');
  kristLogo.emit('attach');
  log.emit('attach');
});

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    //console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    screen.render()
    //console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        //console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        //console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //console.log("Received: '" + message.utf8Data + "'");
            var data = JSON.parse(message.utf8Data);
            if(data.type == "hello") {
                log.log("✔ Succesfully Connected to the Krist Central Server.")
                log.log("✔ MOTD: " + data.motd)
            } else if(data.type == "event") {
                if(data.event == "block") {
                    log.log("✔ #" + data.block.height + " Solved for " + data.block.address + " at " + data.block.value + " Krist.")
                }
                if(data.event == "transaction") {
                  if(data.transaction.type != "mined") {
                    var meta = ""
                    if(data.transaction.metadata != "" && data.transaction.metadata != null) {
                      meta = " (" + data.transaction.metadata + ")";
                    }
                    log.log("✔ " + data.transaction.from + " ➜ " + data.transaction.value + "KST ➜ " + data.transaction.to + meta);
                  }
                }
            }
            //log.log(message.utf8Data)
            screen.render()
        }
    });
    connection.sendUTF(JSON.stringify({id: 1, type:'subscribe', event:'transactions'}));
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
});


axios
  .post('https://krist.ceriat.net/ws/start', {
    //todo: 'Buy the milk'
  })
  .then(res => {
    //console.log(`statusCode: ${res.statusCode}`)
    //console.log(res)
    client.connect(res.data.url, 'echo-protocol');
  })
  .catch(error => {
    //console.error(error)
  })

