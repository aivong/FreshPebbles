var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Downloading RottenTomatoes data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'left',
  backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

// Create an array of Menu items
var mainMenuItems = [
  {title: "Box Office", subtitle: ""}, 
  {title: "Opening Movies", subtitle: ""}, 
  {title: "Upcoming Movies", subtitle: ""}
];

// Construct main menu to show to user
var mainMenu = new UI.Menu({
  sections: [{
    title: 'Fresh Pebbles',
    items: mainMenuItems
  }]
});

// Show the Menu, hide the splash
mainMenu.show();
splashWindow.hide();

// Add actions for main menu items
mainMenu.on('select', function(e) {
  //'Box Office' movies selected
  if(e.itemIndex == 0) {
    // Make request to api.rottentomatoes.com
    ajax(
      {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?limit=10&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
      },
      function(data) {
        var boxOfficeItems = [];
        //fill Box Office Movies list
        for(var i = 0; i < 10; i++) {
          var title = data.movies[i].title;
          boxOfficeItems.push({
            title: title,
            subtitle: ""
          });
        }
        
        // Construct box office menu to show to user
        var boxOfficeMenu = new UI.Menu({
          sections: [{
            title: 'Box Office',
            items: boxOfficeItems
          }]
        });
        boxOfficeMenu.show();  
      },
      function(error) {
        console.log('Download failed: ' + error);
      }
    );
 
  }
});