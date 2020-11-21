const rp = require('request-promise');
const fs = require("fs").promises;

//creating all empty arrays
var list = []; 
var list_1 = [];
var duplicates = [];


const requestOptions = {
    method: 'GET',
    uri: 'https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences'
  };

  var i;
  var text;

  //function to check if there are any duplicates in the array
  function find_duplicate_in_array(arra1) {
    var object = {};
    var result = [];

    arra1.forEach(function (item) {
      if(!object[item])
          object[item] = 0;
        object[item] += 1;
    })

    for (var prop in object) {
       if(object[prop] >= 2) {
           result.push(prop);
       }
    }

    return result;

}

//function to find the level of difference between A & B
function difference(A, B){
    var diffs = 0
    var z;
    var p = Object.keys(new_data[0]);

    for (z=0; z < p.length; z++){

        if (A[p[z]] !== B[p[z]]){
            diffs+=1
        }
    }
    
    return diffs    
}

//function to check for semantic duplicates
function semantic_duplicates(new_data){
    
    var n;
    var m;
    var k;
    var text_1;

    for (n = 0; n < new_data.length; n++){
        for (m = 0; m<n; m++){

            var diff = difference(new_data[n], new_data[m])
            if (diff <= 8){
                duplicates.push(new_data[n])
            }
        }

    }
     
     for (k = 0; k < duplicates.length; k++ ) {
            
        const conf_name = (duplicates[k].confName);
        const conf_start = duplicates[k].confStartDate
        const conf_city = duplicates[k].city
        const conf_country = duplicates[k].country
        const conf_entry = duplicates[k].entryType
        const conf_url = duplicates[k].confRegUrl
        

        if(!conf_city){
            text_1 = `"${conf_name}" ${conf_start}, ${conf_entry}. ${conf_url} `;
            list_1.push(text_1)
        }else{
            text_1 = `"${conf_name}" ${conf_start}, ${conf_city}, ${conf_country}, ${conf_entry}. ${conf_url} `;
            list_1.push(text_1)
        }
        
      }
      console.log(`\n \nThere are ${list_1.length} semantic duplicates and there are as follows: \n ${list_1}`)
}


rp(requestOptions).then((response)=>{
    const data = JSON.parse(response);
    
    {
        new_data = ((data.paid).concat(data.free))

        try{
            
        for (i = 0; i < new_data.length; i++ ) {
            
            const conf_name = (new_data[i].confName);
            const conf_start = new_data[i].confStartDate
            const conf_city = new_data[i].city
            const conf_country = new_data[i].country
            const conf_entry = new_data[i].entryType
            const conf_url = new_data[i].confRegUrl
            

            if(!conf_city){
                text = `${i+1}) "${conf_name}" ${conf_start}, ${conf_entry}, ${conf_url}\n`;
                list.push(text)
            }else{
                text = `${i+1}) "${conf_name}" ${conf_start}, ${conf_city}, ${conf_country}, ${conf_entry}, ${conf_url}\n`;
                list.push(text)
            }

          }
          
          fs.writeFile("conferences list.csv", list);
        
          console.log("\nConference details are saved in a file named 'conferences list.csv'");


        semantic_duplicates(new_data)
        
        console.log(`\nThere are ${find_duplicate_in_array(list).length+1} duplicate entries`)    
          }catch(error) {
            console.log("Error Faced!!")
          }
          
    }
    })