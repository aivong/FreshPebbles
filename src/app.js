var UI = require('ui');
var Vector2 = require('vector2');

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
var menuItems = [
  {title: "Box Office", subtitle: ""}, 
  {title: "Opening Movies", subtitle: ""}, 
  {title: "Upcoming Movies", subtitle: ""}
];

// Construct Menu to show to user
var mainMenu = new UI.Menu({
  sections: [{
    title: 'Fresh Pebbles',
    items: menuItems
  }]
});

// Show the Menu, hide the splash
mainMenu.show();
splashWindow.hide();