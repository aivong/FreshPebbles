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
  if (e.itemIndex == 0) {
    // Make request to api.rottentomatoes.com for Box Office movies
    ajax(
      {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?limit=20&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
      },
      function(data) {
        var boxOfficeItems = [];
        //fill Box Office Movies list
        for(var i = 0; i < 20; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          boxOfficeItems.push({
            title: title,
            subtitle: id,
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
        
        // Add action for selected 'Box Office' movie
        boxOfficeMenu.on('select', function(e) {
            // Make request to api.rottentomatoes.com for selected movie
            ajax(
            {
              url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.subtitle + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
              type:'json'
            },
            function(data) {
              var title = data.title;
              var year = data.year;
              var synopsis = data.synopsis;
              var criticScore = data.ratings.critics_score;
              var audienceScore = data.ratings.audience_score;
              var content = "Critic Score: " + criticScore; 
              content += "\nAudience Score: ";
              content += audienceScore;
              content += "\n" + synopsis;
              // Create detail Card for a selected movie 
              var movieCard = new UI.Card({
                 title: title,
                 subtitle: year,
                 body: content,
                 scrollable: true
               });
              movieCard.show();    
            },
            function(error) {
              console.log('Error: ' + error);
            }
          );
        });
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  }
  else if (e.itemIndex == 1) {
    // Make request to api.rottentomatoes.com for Box Office movies
    ajax(
      {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?limit=20&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
      },
      function(data) {
        var openingMovieItems = [];
        //fill Opening Movies list
        for(var i = 0; i < 20; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          openingMovieItems.push({
            title: title,
            subtitle: id,
          });
        }
        
        // Construct opening movie menu to show to user
        var openingMovieMenu = new UI.Menu({
          sections: [{
            title: 'Opening Movies',
            items: openingMovieItems
          }]
        });
        openingMovieMenu.show();  
        
        // Add action for selected 'Opening' movie
        openingMovieMenu.on('select', function(e) {
            // Make request to api.rottentomatoes.com for selected movie
            ajax(
            {
              url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.subtitle + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
              type:'json'
            },
            function(data) {
              var title = data.title;
              var year = data.year;
              var synopsis = data.synopsis;
              var criticScore = data.ratings.critics_score;
              var audienceScore = data.ratings.audience_score;
              var content = "Critic Score: " + criticScore; 
              content += "\nAudience Score: ";
              content += audienceScore;
              content += "\n" + synopsis;
              // Create detail Card for a selected movie 
              var movieCard = new UI.Card({
                 title: title,
                 subtitle: year,
                 body: content,
                 scrollable: true
               });
              movieCard.show();    
            },
            function(error) {
              console.log('Error: ' + error);
            }
          );
        });
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  }
 else if (e.itemIndex == 2) {
    // Make request to api.rottentomatoes.com for Upcoming movies
    ajax(
      {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json?page_limit=20&page=1&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
      },
      function(data) {
        var total = data.total;
        var upcomingMovieItems = [];
        //fill Upcoming Movies list
        for(var i = 0; i < data.total; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          upcomingMovieItems.push({
            title: title,
            subtitle: id,
          });
        }
        
        // Construct upcoming movie menu to show to user
        var upcomingMovieMenu = new UI.Menu({
          sections: [{
            title: 'Upcoming Movies',
            items: upcomingMovieItems
          }]
        });
        upcomingMovieMenu.show();  
        
        // Add action for selected 'Upcoming' movie
        upcomingMovieMenu.on('select', function(e) {
            // Make request to api.rottentomatoes.com for selected movie
            ajax(
            {
              url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.subtitle + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
              type:'json'
            },
            function(data) {
              var title = data.title;
              var year = data.year;
              var synopsis = data.synopsis;
              var criticScore = data.ratings.critics_score;
              var audienceScore = data.ratings.audience_score;
              var content = "Critic Score: " + criticScore; 
              content += "\nAudience Score: ";
              content += audienceScore;
              content += "\n" + synopsis;
              // Create detail Card for a selected movie 
              var movieCard = new UI.Card({
                 title: title,
                 subtitle: year,
                 body: content,
                 scrollable: true
               });
              movieCard.show();    
            },
            function(error) {
              console.log('Error: ' + error);
            }
          );
        });
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  }
});

