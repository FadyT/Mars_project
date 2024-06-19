
let store = {
    user: { name: "Fady" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

let latestJsonRes 

/////////////////////
// get rovers data //
/////////////////////
//https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=DKBnuj7smJIMm8dLpP0eJ0Kv7zfupNadB9XdNuUG
//XjrEKxCjucob6GLqGj9Y0zVdqsQgiukRatzrJVAW
    async function GetCuriostyData (){
        const response = await fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1&api_key=DKBnuj7smJIMm8dLpP0eJ0Kv7zfupNadB9XdNuUG');
        const data = await response.json();
        latestJsonRes = data
        return data
    }

const ImageElement = (newUrl) => {
    //console.log("url src is : " + newUrl)

    edit_save = document.getElementById("imageID");
    edit_save.src = newUrl;
}

const detailsElement = (txt) => {
    document.getElementById("explanation").innerText = txt;
}

let randomIndex = function (First , Second){
    return Math.floor(Math.random() * Second) + First
}

function updateUI (url , details , UpdateImage , UpdateDetails){
    /*console.log(url)
    console.log(details)
    console.log(UpdateImage)
    console.log(UpdateDetails)*/
    UpdateDetails(details)
    UpdateImage(url)
}

    let RoverDataUpdater = async function GetOpportunityData (roverName){
        const response = await fetch("https://api.nasa.gov/mars-photos/api/v1/rovers/" + roverName+ "/photos?sol=1000&page=0&api_key=DKBnuj7smJIMm8dLpP0eJ0Kv7zfupNadB9XdNuUG")
        const data = await response.json();
        latestJsonRes = data
        const immutableObj = Immutable.fromJS(data.photos);
        let map = immutableObj.get(randomIndex(0 ,immutableObj.size ))

        UpdateDataFromMap(map)
        return map

        
        //console.log("Earth Data opportunityData : " +JSON.stringify(data.photos[0].earth_date));
        // convert api data to immutable list containing maps for each map it has 
        // {id , sol , camera : Map , img_src , earth_date ,
        // rover :Map with max_date name cameras status max_sol landing_date launch_date id total_photos parameters}
        //console.log("List Size : " +immutableObj.size);
        // Get Map of index from the list of Maps
        // return a random map for rover 
        //console.log(map.toString());

    }


    function UpdateDataFromMap (map ){

        updateUI(   map.get('img_src') ,
                    "Rover Max Date is : " + map.getIn(['rover', 'max_date']) + "\n" 
                  + "Rover Full Name is : " + map.getIn(['rover', 'name'])  + "\n"
                  + "Rover Landing Date is : " + map.getIn(['rover', 'landing_date']) + "\n" 
                  + "Rover Launch Date : " + map.getIn(['rover', 'launch_date']) ,
                    ImageElement ,
                    detailsElement)


        /*
        ///////////////////////////////////////
        //////////Loginig data from api////////
        ///////////////////////////////////////

        if(paramterKey != null){
            console.log(map.getIn(['rover', 'max_date']))
            console.log("////////////////////////")
            console.log(map.getIn(['rover', 'name']))
            console.log("////////////////////////")
            console.log(map.getIn(['rover', 'landing_date']))
            console.log("////////////////////////")
            console.log(map.getIn(['rover', 'launch_date']))
            return (map.getIn([paramterKey, parameterName]))
        }
        console.log(map.get('parameterName'))
        console.log("////////////////////////")
        console.log(map.get('earth_date'))
        console.log("////////////////////////")
        return map.get(parameterName)
        */
    }

            
// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

function print (dataUpdaterFun , roverName){
    //console.log("Clicked !")
    dataUpdaterFun(roverName)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            <!-- Create 3 buttons one for each rover -->
            ${createBtn("Curiosity" , "print(RoverDataUpdater , 'Curiosity')")}
            ${createBtn("Opportunity" , "print(RoverDataUpdater , 'Opportunity')")}
            ${createBtn("Spirit" ,"print(RoverDataUpdater ,'Spirit')")}
            ${createBtn("Picture of today " , "location.reload()" )}

            ${Greeting(store.user.name)}
            <section>
                <!-- <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>-->
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
    const Greeting = (name) => {
        if (name) {
            return `
                <h1>Welcome, ${name}!</h1>
            `
        }

        return `
            <h1>Hello!</h1>
    `
}


function createBtn (text ,func) {
    
    return `
        <button type="button" onclick="${func}">${text}</button>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)

    //console.log(photodate.getDate(), today.getDate());
    //console.log(photodate.getDate() === today.getDate());
    
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p  id="imageID">See today's featured video <a href="${apod && apod.url}">here</a></p>
            <p  id="title">${apod && apod.title}</p>
            <p  id="explanation">${apod && apod.explanation}</p>
        `)
    } else {
        return (`
            <img id="imageID" src="${apod && apod.image.url}" height="350px" width="100%" />
            <p id="explanation">${apod && apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then((apod) => {
            updateStore(store, { apod })
            latestJsonRes = apod
        }
        )
        


}
