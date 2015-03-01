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

// Create main menu items
var mainMenuItems = [
  {title: "Movie Lists", subtitle: ""}, 
  {title: "DVD Lists", subtitle: ""}, 
  {title: "About", subtitle: ""}, 
];
  
// Construct main menu to show to user
var mainMenu = new UI.Menu({
  sections: [{
    title: 'FreshPebbles',
    items: mainMenuItems
  }]
});

// Create an array of 'Movie Lists' Menu items
var movieListsMenuItems = [
  {title: "Box Office", subtitle: ""}, 
  {title: "In Theaters", subtitle: ""}, 
  {title: "Opening Movies", subtitle: ""}, 
  {title: "Upcoming Movies", subtitle: ""}
];

// Construct 'Movie Lists' menu 
var movieListsMenu = new UI.Menu({
  sections: [{
    title: 'Movie Lists',
    items: movieListsMenuItems
  }]
});

// Create an array of 'DVD Lists' Menu items
var dvdListsMenuItems = [
  {title: "Top Rentals", subtitle: ""}, 
  {title: "Current Release DVDs", subtitle: ""}, 
  {title: "New Release DVDs", subtitle: ""}, 
];

// Construct 'DVD Lists' menu 
var dvdListsMenu = new UI.Menu({
  sections: [{
    title: 'DVD Lists',
    items: dvdListsMenuItems
  }]
});

 // Create an array of selected movie's menu items
var movieMenuItems = [
  {title: "Movie Info", subtitle: "", id: ""}, 
  {title: "Cast Info", subtitle: "", id: ""}, 
  {title: "Reviews", subtitle: "", id: ""}, 
  {title: "Similar Movies", subtitle: "", id: ""}
];

// Construct movie menu 
  var movieMenu = new UI.Menu({
     sections: [{
          title: "",
          items: movieMenuItems
     }]
});

function loadMovie(data) {
  var title = data.title;
  var year = data.year;
  var synopsis = data.synopsis;
  var criticScore = data.ratings.critics_score;
  var audienceScore = data.ratings.audience_score;
  if(criticScore == -1) {
     criticScore = "NA";   //Not yet rated by critics
  }
  if(audienceScore == -1) {
     audienceScore = "NA"; //Not yet rated by audiences
  }
  var content = "Critic Score: " + criticScore; 
     content += "\nAudience Score: ";
     content += audienceScore;
     content += "\n" + synopsis;
     // Create detail Card for a selected movie 
     var movieCard = new UI.Card({
        title: title + " (" + year + ")",
        subtitle: "",
        body: content,
        scrollable: true,
        style: "small"
     });
     movieCard.show();    
}

function loadCast(data) {
     var content = "";
     for(var i = 0; i < 9; i++) {
          content += data.cast[i].name;
          content += " as ";
          if(typeof data.cast[i].characters[0] == 'undefined') {
            content += "Unknown,\n";
          }
          else {
            content += data.cast[i].characters[0] + ",\n";
          }
     }  
     //Formatting for the last item
     content += data.cast[9].name;
     content += " as ";
     if(typeof data.cast[9].characters[0] == 'undefined') {
         content += "Unknown,\n";
     }
     else {
         content += data.cast[9].characters[0];
     }
     //Construct Cast Card
     var castCard = new UI.Card({
          title: "Cast Info",
          subtitle: "",
          body: content,
          scrollable: true,
          style: "small"
     });
     castCard.show();   
}

// Show the Menu, hide the splash
mainMenu.show();
splashWindow.hide();

// Add actions for 'main menu' menu items
mainMenu.on('select', function(e) {
  //'Movie Lists' selected
  if (e.itemIndex == 0) {   
    movieListsMenu.show();
  }
  //'DVD Lists' selected
  else if (e.itemIndex == 1) {
    dvdListsMenu.show();
  }
  //'About' selected
  else if (e.itemIndex ==2) {
     var aboutCard = new UI.Card({
        title: "About",
        subtitle: "",
        body: "Uses the public RottenTomatoes API"
     });
     aboutCard.show();      
  }
});

// Add actions for 'Movie Lists' menu items
movieListsMenu.on('select', function(e) {
  //'Box Office' selected
  if (e.itemIndex == 0) {
    // Make request to api.rottentomatoes.com for Box Office movies
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
          var id = data.movies[i].id;
          boxOfficeItems.push({
            title: title,
            subtitle: "",
            id: id
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
             movieMenuItems[0].id = e.item.id;
             movieMenuItems[1].id = e.item.id;
             movieMenuItems[2].id = e.item.id;
             movieMenuItems[3].id = e.item.id;
             
             movieMenu.show();    
             
             movieMenu.on('select', function(e) {  
                 //'Movie Info' selected
                 if(e.itemIndex == 0) {
                   // Make request to api.rottentomatoes.com for selected movie's info
                   ajax(
                   {
                     url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                     type:'json'
                   },
                   function(data) {
                     loadMovie(data);
                   },
                   function(error) {
                     console.log('Error: ' + error);
                   }
                  ); 
                }
                //'Cast Info' selected
                else if(e.itemIndex == 1) {
                    // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/cast.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                         loadCast(data);
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
               //'Reviews' selected
               else if(e.itemIndex == 2) {
                 console.log(e.item.id);
                  // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/reviews.json?review_type=all&page_limit=20&page=1&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                         var freshCount = 0;
                         var rottenCount = 0;
                         var total = data.reviews.length;
                         for(var i = 0; i < total; i++) {
                           if(data.reviews[i].freshness == "rotten") {
                             rottenCount++;
                           }
                           else {
                             freshCount++;
                           }
                         }
                         var freshPercentage; 
                         var rottenPercentage;
                         if(total !== 0) {
                           freshPercentage = (freshCount/total)*100 + "%";
                           rottenPercentage = (rottenCount/total)*100 + "%";
                         }
                         else {
                           freshPercentage = "0%";
                           rottenPercentage = "0%";
                         }
                         
                         var reviewsMenuItems = [
                          {title: "Fresh " + freshPercentage, subtitle: "", id: ""}, 
                          {title: "Rotten " + rottenPercentage, subtitle: "", id: ""}, 
                          ];
                           
                           // Construct reviews menu 
                            var reviewsMenu = new UI.Menu({
                               sections: [{
                                    title: "",
                                    items: reviewsMenuItems
                               }]
                          });
                          reviewsMenu.show();
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
            });
      }); 
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  }
  //'In Theaters' selected
  else if (e.itemIndex == 1) {
    // Make request to api.rottentomatoes.com for In Theaters movies
    ajax(
      {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?page_limit=10&page=1&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
      },
      function(data) {
        var inTheatersItems = [];
        //fill In Theaters Movies list
        for(var i = 0; i < 10; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          inTheatersItems.push({
            title: title,
            subtitle: "",
            id: id
          });
        }
        
        // Construct opening movie menu to show to user
        var inTheatersMenu = new UI.Menu({
          sections: [{
            title: 'In Theaters',
            items: inTheatersItems
          }]
        });
        inTheatersMenu.show();  
        
        // Add action for selected 'In Theaters' movie
        inTheatersMenu.on('select', function(e) {
             movieMenuItems[0].id = e.item.id;
             movieMenuItems[1].id = e.item.id;
             movieMenuItems[2].id = e.item.id;
             movieMenuItems[3].id = e.item.id;
          
             movieMenu.show();    
             
             movieMenu.on('select', function(e) {  
                //'Movie Info' selected
                if(e.itemIndex == 0) {
                   // Make request to api.rottentomatoes.com for selected movie
                   ajax(
                   {
                     url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                     type:'json'
                   },
                   function(data) {
                     loadMovie(data);
                   },
                   function(error) {
                     console.log('Error: ' + error);
                   }
                  ); 
               }
                //'Cast Info' selected
                else if(e.itemIndex == 1) {
                    // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/cast.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                          loadCast(data);
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
            });
        });
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  }
  //'Opening Movies' selected
  else if (e.itemIndex == 2) {
    // Make request to api.rottentomatoes.com for Opening movies
    ajax(
      {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?limit=10&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
      },
      function(data) {
        var openingMovieItems = [];
        //fill Opening Movies list
        for(var i = 0; i < 10; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          openingMovieItems.push({
            title: title,
            subtitle: "",
            id: id
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
             movieMenuItems[0].id = e.item.id;
             movieMenuItems[1].id = e.item.id;
             movieMenuItems[2].id = e.item.id;
             movieMenuItems[3].id = e.item.id;
          
             movieMenu.show();  
          
             movieMenu.on('select', function(e) {  
                //'Movie Info' selected
                if(e.itemIndex == 0) {
                   // Make request to api.rottentomatoes.com for selected movie
                   ajax(
                   {
                     url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                     type:'json'
                   },
                   function(data) {
                     loadMovie(data);
                   },
                   function(error) {
                     console.log('Error: ' + error);
                   }
                  ); 
               }
                //'Cast Info' selected
                else if(e.itemIndex == 1) {
                    // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/cast.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                          loadCast(data);
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
            });
        });
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  }
  //'Upcoming Movies' selected
  else if (e.itemIndex == 3) {
    // Make request to api.rottentomatoes.com for Upcoming movies
    ajax(
      {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json?page_limit=10&page=1&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
      },
      function(data) {
        var upcomingMovieItems = [];
        //fill Upcoming Movies list
        for(var i = 0; i < 10; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          upcomingMovieItems.push({
            title: title,
            subtitle: "",
            id: id
          });
        }
        
        // Construct upcoming movie menu 
        var upcomingMovieMenu = new UI.Menu({
          sections: [{
            title: 'Upcoming Movies',
            items: upcomingMovieItems
          }]
        });
        upcomingMovieMenu.show();  
        
        // Add action for selected 'Upcoming' movie
        upcomingMovieMenu.on('select', function(e) {
             movieMenuItems[0].id = e.item.id;
             movieMenuItems[1].id = e.item.id;
             movieMenuItems[2].id = e.item.id;
             movieMenuItems[3].id = e.item.id;
          
             movieMenu.show();    
             
             movieMenu.on('select', function(e) {  
                //'Movie Info' selected
                if(e.itemIndex == 0) {
                   // Make request to api.rottentomatoes.com for selected movie
                   ajax(
                   {
                     url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                     type:'json'
                   },
                   function(data) {
                     loadMovie(data);
                   },
                   function(error) {
                     console.log('Error: ' + error);
                   }
                  ); 
               }
                //'Cast Info' selected
                else if(e.itemIndex == 1) {
                    // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/cast.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                          loadCast(data);
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
            });
        });
      },
      function(error) {
        console.log('Error: ' + error);
      }
    );
  }
});

// Add actions for 'DVD Lists' menu items
dvdListsMenu.on('select', function(e) {
  //'Top Rentals' selected
  if (e.itemIndex == 0) {  
     ajax(
     {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?limit=10&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
     },
     function(data) {
        var topRentalsItems = [];
        for(var i = 0; i < 10; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          topRentalsItems.push({
            title: title,
            subtitle: "",
            id: id
          });          
        }
       
        // Construct top rentals menu 
        var topRentalsMenu = new UI.Menu({
          sections: [{
            title: 'Top Rentals',
            items: topRentalsItems
          }]
        });
        topRentalsMenu.show();
       
        // Add action for selected 'Top Rental' dvd
        topRentalsMenu.on('select', function(e) {
             movieMenuItems[0].id = e.item.id;
             movieMenuItems[1].id = e.item.id;
             movieMenuItems[2].id = e.item.id;
             movieMenuItems[3].id = e.item.id;
          
             movieMenu.show();  
             
             movieMenu.on('select', function(e) {  
                //'Movie Info' selected
                if(e.itemIndex == 0) {
                   // Make request to api.rottentomatoes.com for selected movie
                   ajax(
                   {
                     url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                     type:'json'
                   },
                   function(data) {
                     loadMovie(data);
                   },
                   function(error) {
                     console.log('Error: ' + error);
                   }
                  ); 
               }
                //'Cast Info' selected
                else if(e.itemIndex == 1) {
                    // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/cast.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                        loadCast(data);
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
            });
        });
     },
     function(error) {
        console.log('Error: ' + error);
     }
    );     
  }
  //'Current Release DVDs' selected
  else if (e.itemIndex == 1) {
     ajax(
     {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/current_releases.json?page_limit=10&page=1&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
     },
     function(data) {
        var currentReleaseItems = [];
        for(var i = 0; i < 10; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          currentReleaseItems.push({
            title: title,
            subtitle: "",
            id: id
          });          
        }
       
        // Construct current release menu 
        var currentReleaseMenu = new UI.Menu({
          sections: [{
            title: 'Current Release DVDs',
            items: currentReleaseItems
          }]
        });
        currentReleaseMenu.show();
       
        // Add action for selected 'Current Release DVDs' dvd
        currentReleaseMenu.on('select', function(e) {
             movieMenuItems[0].id = e.item.id;
             movieMenuItems[1].id = e.item.id;
             movieMenuItems[2].id = e.item.id;
             movieMenuItems[3].id = e.item.id;

             movieMenu.show();     
             
             movieMenu.on('select', function(e) {  
                //'Movie Info' selected
                if(e.itemIndex == 0) {
                   // Make request to api.rottentomatoes.com for selected movie
                   ajax(
                   {
                     url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                     type:'json'
                   },
                   function(data) {
                     loadMovie(data);
                   },
                   function(error) {
                     console.log('Error: ' + error);
                   }
                  ); 
               }
                //'Cast Info' selected
                else if(e.itemIndex == 1) {
                    // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/cast.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                         loadCast(data);
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
            });
        });
     },
     function(error) {
        console.log('Error: ' + error);
     }
    );         
  }
  //'New Release DVDs' selected
  else if (e.itemIndex == 2) {
     ajax(
     {
        url:'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?page_limit=10&page=1&country=us&apikey=3u9s7zwwta4u97p2q3fp7t6x',
        type:'json'
     },
     function(data) {
        var newReleaseItems = [];
        for(var i = 0; i < 10; i++) {
          var title = data.movies[i].title;
          var id = data.movies[i].id;
          newReleaseItems.push({
            title: title,
            subtitle: "",
            id: id
          });          
        }
       
        // Construct current release menu 
        var newReleaseMenu = new UI.Menu({
          sections: [{
            title: 'New Release DVDs',
            items: newReleaseItems
          }]
        });
        newReleaseMenu.show();
       
        // Add action for selected 'Current Release DVDs' dvd
        newReleaseMenu.on('select', function(e) {
             movieMenuItems[0].id = e.item.id;
             movieMenuItems[1].id = e.item.id;
             movieMenuItems[2].id = e.item.id;
             movieMenuItems[3].id = e.item.id;
          
             movieMenu.show();       
             
             movieMenu.on('select', function(e) {  
                //'Movie Info' selected
                if(e.itemIndex == 0) {
                   // Make request to api.rottentomatoes.com for selected movie
                   ajax(
                   {
                     url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                     type:'json'
                   },
                   function(data) {
                     loadMovie(data);
                   },
                   function(error) {
                     console.log('Error: ' + error);
                   }
                  ); 
               }
                //'Cast Info' selected
                else if(e.itemIndex == 1) {
                    // Make request to api.rottentomatoes.com for selected movie's cast info
                    ajax(
                      {
                          url:'http://api.rottentomatoes.com/api/public/v1.0/movies/' + e.item.id + '/cast.json?apikey=3u9s7zwwta4u97p2q3fp7t6x',
                          type:'json'
                      },
                      function(data) {
                          loadCast(data);
                      },
                      function(error) {
                         console.log('Error: ' + error);
                      }
                    ); 
               }
            });
        });
     },
     function(error) {
        console.log('Error: ' + error);
     }
    );             
  }
});
