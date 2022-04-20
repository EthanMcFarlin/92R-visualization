// Variable for the visualization instance
let homePriceMap;
let state_data_collection = {};
let state_region_demo_data = {};
let state_combined_collection = {};
let state_analytical = {};
let state_racial_collection = {};
let state_health_agencies = {};

// let state_HPI_data = {};
// let state_HPI_change_data = {};

d3.csv("data/data_transparency_indices.csv").then(csv=> {

    csv.forEach(function(d){
        // state_HPI_data[d.FIPS] = d.HPI;
        // state_HPI_change_data[d.FIPS] = d.HPI_change;

        // DataCollection_Index
        // RegionDemo_Index
        // CombinedCollection_Index
        // Analytical_Index
        // RacialCollectionIndex
        // HealthAgencies

        state_data_collection[d.FIPS] = d.DataCollection_Index;
        state_region_demo_data[d.FIPS] = d.RegionDemo_Index;
        state_combined_collection[d.FIPS] = d.CombinedCollection_Index;
        state_analytical[d.FIPS] = d.Analytical_Index;
        state_racial_collection[d.FIPS] = d.RacialCollectionIndex;
        state_health_agencies[d.FIPS] = d.HealthAgencies;

    });

    d3.json("data/us-states.json").then(jsonData =>{
        let states = jsonData;

        states.features.forEach(function(d){
            // d.properties.HPI = state_HPI_data[d.id];
            // d.properties.HPI_change = state_HPI_change_data[d.id];

            d.properties.DataCollection_Index = state_data_collection[d.id];
            d.properties.RegionDemo_Index = state_region_demo_data[d.id];
            d.properties.CombinedCollection_Index = state_combined_collection[d.id];
            d.properties.Analytical_Index = state_analytical[d.id];
            d.properties.RacialCollectionIndex = state_racial_collection[d.id];
            d.properties.HealthAgencies = state_health_agencies[d.id];

        });

        homePriceMap = new HomePriceIndexMap("price-map", states);

    });

});


d3.select("#variable-type").on("change", changeFilter);

function changeFilter(){
    variable_value = d3.select("#variable-type").property("value");
    d3.select(".HPIMapStateInfo").remove();
    homePriceMap.updateVis(variable_value)
}