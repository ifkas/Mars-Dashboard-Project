// We set here immutable key:value pairs and create a store/state where we store the data
// Immutable data object
let store = Immutable.Map({
    apod: '',
});

// We grab the root div
const root = document.getElementById('root');

// We update the store on each click and re-render the view with the updated store
const updateStore = (store, newState) => {
    const updatedState = store.set('apod', newState);
    render(root, updatedState);
};

// We render and add our markup to the page
const render = async (root, state) => {
    root.innerHTML = App(state);
};

// Components from which the html is rendered
function App(state) {
    if (state.get('apod')) {
        return `
        <main>
            <div class="info-card padded row">
                <div class="six columns">
                    ${roverInfo(state)}
                </div>
            </div>
            <div class="padded row">
                ${roverImages(state)}
            </div>
            <div class="row">
                <footer class="u-full-width text-center">
                    <p>Mars Dashboard 2021 - delivering the latest rover news.</p>
                </footer>
            </div>
        </main>'
        `;
    }
    else {
        return `
        <main>
            <div class="info-card row">
                <div class="u-full-width">
                    <h5>Please click on the buttons above to load the latest news from the Mars rovers.</h5>
                </div>
            </div>
        </main>
        `;
    }
};

// Generate the information about the rover
function roverInfo(state) {
    return `
    <p>Status:
        ${state.get('apod').Status}
    </p>
    <p>Launch Date:
        ${state.get('apod').LaunchDate}
    </p>
    <p>Landing Date:
        ${state.get('apod').LandingDate}
    </p>
    <p>Most Recent Photo Date:
        ${state.get('apod').MostRecentPhotoDate}
    </p>`;
}

// The loader
function loader(roverNames) {
    return `<h3>Please wait for the ${roverNames} rover to get your images...</h3>`
}


// Let's display the rover images
function roverImages(state) {
    const roverImages = state.get('apod').photosArray;
    const roverNames = state.get('apod').RoverName;
    const totalImages = state.get('apod').photosArray.length;
    const photosArray = roverImages.slice(-4).map(photo => `<img src="${photo}">`);
    return photos(photosArray, roverNames, totalImages);
}

// Let's get the total number of images from the selected rover
function totalChange(totalImages) {
    if(totalImages > 4) {
        return `Showing only 4 images of total ${totalImages} images`
    } else {
        return `This rover has total of ${totalImages} images`
    }
}

// Let's get the name and the images from the selected rover
function photos(photos, roverNames, totalImages) {
    if(photos != '') {
        return (`
        <div class="six columns">
            <h4>Latest images from ${roverNames}:</h4>
        </div>
        <div class="six columns text-right">
            <p>${totalChange(totalImages)}</p>
        </div>
        ${photos}
        `);
    } else {
        return loader(roverNames);
    }
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
    let perseveranceButton = document.getElementById('perseverance');
    let opportunityButton = document.getElementById('opportunity');
    let curiosityButton = document.getElementById('curiosity');
    perseveranceButton.addEventListener('click', () => roverData('Perseverance'));
    opportunityButton.addEventListener('click', () => roverData('Opportunity'));
    curiosityButton.addEventListener('click', () => roverData('Curiosity'));
});

// Get the data
async function roverData(roverName) {
    const response = await fetch(`/get${roverName}Data`);
    const latestEntry = await response.json();
    const RoverName = latestEntry.latest_photos[0].rover.name;
    const LandingDate = latestEntry.latest_photos[0].rover.landing_date;
    const LaunchDate = latestEntry.latest_photos[0].rover.launch_date;
    const Status = latestEntry.latest_photos[0].rover.status;
    const MostRecentPhotoDate = latestEntry.latest_photos[0].earth_date;
    const recentPhoto = latestEntry.latest_photos;
    const photosArray = recentPhoto.map((photo) => {
        return photo.img_src;
    });

    updateStore(store, {
        RoverName: RoverName,
        Status: Status,
        LaunchDate: LaunchDate,
        LandingDate: LandingDate,
        MostRecentPhotoDate: MostRecentPhotoDate,
        photosArray: photosArray,
    });

}