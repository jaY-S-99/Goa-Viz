function create_a_map(start_row,end_row,start_column,end_column,map_number){
	//This function creates another instance of map with given inline grid parameters in the ouetmost-container

	//div_map_space is the container for a single map isntance
	let div_map_space = d3.select('.outermost-container')
													.append('div')
														.attr('class','map-space-container' + ' ' + map_number)
														.style('grid-row-start',start_row)
														.style('grid-row-end',end_row)
														.style('grid-column-start',start_column)
														.style('grid-column-end',end_column);

	//div_map is the container for map shape
	let div_map_area = div_map_space.append('div')
																		.attr('class','map-area')
																		.attr('map_number',map_number)
																		.style('grid-row-start','1')
																		.style('grid-row-end','5')
																		.style('grid-column-start','1')
																		.style('grid-column-end','5');

	//div_legend is the div that stores the legend of the map selected
	let div_legend = div_map_space.append('div')
																	.attr('class','legend-area')
																	.attr('map_number',map_number)
																	.style('grid-row-start', () => {
																		let selected = $("input[type='radio'][name='numMaps']:checked");
																		if (selected.length > 0) {
																			numMaps = selected.val();
																			console.log(numMaps + " nummaps");
																		};
																		if(numMaps==="4"){return "1"}else{return "3"}})
																	.style('grid-row-end','5')
																	.style('grid-column-start','1')
																	.style('grid-column-end','2');

	//div_selector_area is the div which holds the map selectors
	let div_selector_area = div_map_space.append('div')
																				.attr('class','selector-area')
																				.attr('map_number',map_number)
																				.style('grid-row-start','1')
																				.style('grid-row-end','2')
																				.style('grid-column-start','4')
																				.style('grid-column-end','5');

	div_selector_area.append('select')
											.attr('id','map-class-selector-' + map_number)
											.attr('class','map-class-selector custom-select')
											.html('<option style=\"color:#DCDCDC\" selected disabled>Select a Map Type</option><option value="Census">Census Unit Map</option><option value="VP">Village Panchayat Map</option>');

	div_selector_area.append('select')
											.attr('class','map-selector custom-select')
											.attr('id','map-selector-'+map_number);

	d3.select('#map-class-selector-'+map_number).on('change',function(){
		d3.select('#map-selector-'+map_number)
				.html(function(){
							let map_class_value = d3.select('#map-class-selector-'+map_number).node().value;
							if(map_class_value === 'Census')
							{
								let cen_temp = '<option selected style=\"color:#DCDCDC\" disabled>Select a Map</option>';
								c_maps.forEach((d) => {cen_temp = cen_temp + '<option value=\"'+d[0] +'\">'+d[1]+'</option>'});
								return cen_temp;
							}
							else{
								let vp_temp = '<option selected style=\"color:#DCDCDC\" disabled>Select a Map</option>';
								vp_maps.forEach((d) => {vp_temp = vp_temp + '<option value=\"'+d[0] +'\">'+d[1]+'</option>'});
								return vp_temp;
							}
						});
					})

	div_selector_area.append('select')
											.attr('class','property-selector'+ ' ' + map_number + ' custom-select')
											.attr('id','property-selector-'+ map_number);

	//div_info_area is the div which has additional information on the selectedProperty
	let div_info_area = div_map_space.append('div')
																		.attr('class','info-area')
																		.attr('map_number',map_number)
																		.style('grid-row-start','2')
																		.style('grid-row-end','5')
																		.style('grid-column-start','4')
																		.style('grid-column-end','5');

  //This div is for the tooltip to be shown when hovered over a census unit
	let div_tooltip = div_map_space.append('div')
																	.attr('class','tooltip')
																	.attr('map_number',map_number)
																	.style('display','none');

	d3.select('#map-selector-'+map_number)
			.on('change',function(d){ let map_type = d3.select('#map-selector-'+map_number).node().value;
				Promise.all([d3.json(map[map_type]),d3.csv(data[map_type])]).then(([d1,d2]) => {render_map(map_number,d1,d2)});});
}

function render_map(map_number,json,csv){
	//removing previously made elements
	d3.selectAll('.svg-element[map_number=\"'+map_number+'\"]').remove();
	d3.selectAll('.group-of-shapes[map_number=\"'+map_number+'\"]').remove();
	//clearing prev legends
	d3.select('.legend-area[map_number=\"' + map_number + '\"]')
		.html('');

	let type_of_map_selected = d3.select('#map-selector-'+map_number).node().value;
	type_of_map_selected = type_of_map_selected.charAt(0).toUpperCase() + type_of_map_selected.slice(1);

	let temp_html = "";
	csv.columns.forEach(function(d){
		if (!discarded_properties.includes(d)) { temp_html = temp_html + '<option value = \"' + d + '\">' + capitalizeFirstLetterAndRemoveExtras(d)+'</option>';}
	});
	d3.select('#property-selector-'+map_number).html(temp_html);
	d3.select('#property-selector-'+map_number)
		.on('change',function(d){render_property(map_number,csv);});


	let height = d3.select('.map-space-container').node().getBoundingClientRect().height;
	let width = d3.select('.map-space-container').node().getBoundingClientRect().width;

	let svg = d3.select('.map-area[map_number=\"'+map_number+'\"]')
								.append('svg')
									.attr('class','svg-element')
									.attr('map_number',map_number)
									.attr('height',height)
									.attr('width',width);


	let g = svg.append('g')
								.attr('class','group-of-shapes')
								.attr('map_number',map_number);

	//projecting lat long on xy
  let projections = d3.geoMercator()
                        .fitExtent([[0,0],[height,width]], json);

  //creating geopaths
  let geoGenerator = d3.geoPath()
                      .projection(projections);

  //using json file to create DOM elements
  let u = g.selectAll('path')
            .data(json.features);

  // filling in for the new elements
  u.enter()
    .append('path')
      .attr('d',geoGenerator)
      .attr('fill',"black")
      .attr('stroke',"black")
      .attr('stroke-width','0.25px')
      .attr('class',"map-unit")
      .attr('fill-opacity',0.1)
			.attr('id',function(d){
				if(d.properties.CEN_2011){
				return d.properties.CEN_2011;}
				else{
					if(d.properties.CEN_2001)
					{
						return d.properties.CEN_2001;
					}
					else {
						if(d.properties.CEN_1991)
						{
							return d.properties.CEN_1991;
						}
						else {
							if(d.properties.layer){
								return (d.properties.layer + '_' + +d.properties.ID);
							}
							else{
								return (type_of_map_selected+'_'+d.properties.ID);
							}
						}
					}
			}})
			.attr('Name',(d) => d.properties.NAME);

	let zoom = d3.zoom().scaleExtent([0.7,8]).on('zoom', zoomed);
	d3.selectAll('.svg-element[map_number=\"'+map_number+'\"]').call(zoom).call(zoom.transform, d3.zoomIdentity.translate(width/4,0).scale(0.8));

	function zoomed(){
	  d3.selectAll('g[map_number=\"'+map_number+'\"]').attr('transform',d3.event.transform);
	}
}

function render_property(map_number,csv){
	let selectedProperty = d3.select('#property-selector-' + map_number).node().value;
	let map_type = d3.select('#map-class-selector-'+map_number).node().value;
	let type_of_map_selected = d3.select('#map-selector-'+map_number).node().value;
	type_of_map_selected = type_of_map_selected.charAt(0).toUpperCase() + type_of_map_selected.slice(1);
	let propertyValuesAndID;

	if(map_type === 'VP'){
		if(type_of_map_selected === 'Vp_final'){
			let vals = Object.keys(starting_pos_vp);
			vals.unshift("N/A");
			let vpName = d3.scaleThreshold()
											.domain(Object.values(starting_pos_vp))
											.range(vals);
			console.log(vals);
			propertyValuesAndID = csv.map(function(d,i){return [vpName(i)+"_"+String(d['ID']),d[selectedProperty]]});
		}
		else{
			propertyValuesAndID = csv.map(function(d){return [type_of_map_selected + "_" + String(d['ID']),d[selectedProperty]]});
		}
	}
	else{
		propertyValuesAndID = csv.map(function(d){return [String(d['State'])+String(d['District'])+String(d['Subdistt'])+String(d['Town/Village']),d[selectedProperty],d['Name']];});
	}

	console.log(propertyValuesAndID);
	if(special_vars[selectedProperty]){
		//THIS PART IS TO UPDATE SPECIAL VARIABLES WHICH NEED SPECIAL DEPICTION OR COLOR SCHEME
		let propertyVals = propertyValuesAndID.map((d) => {if(d[1]){return d[1];}});
		if(special_vars[selectedProperty][1]==='Categorical'){
			propertyVals = [...new Set(propertyVals)];
			propertyVals = propertyVals.map((d) => {if(!isNaN(d)){return d;}});
			let spec_colours = special_vars[selectedProperty][0][0];
			propertyValuesAndID.forEach(function(d){
					d3.select('g[map_number=\"'+map_number+'\"] > path[id=\"'+d[0]+'\"]')
					.attr('fill',spec_colours[d[1]] ? spec_colours[d[1]] : unidentifiedColour)
					.attr('fill-opacity',1);
			});
		}
		addLegend(map_number, special_vars[selectedProperty][2], true);
	}
	else{
		//THIS PART IS FOR GENERAL VARIABLES WHICH WILL BE REPRESENTED THROUGHT STANDARD CHOROPLETH MAP OR NORMAL CATEGORICAL
		let propertyVals = propertyValuesAndID.map((d) => {if(d[1]){return d[1];}});
		let numberOfDisinctVals = [...new Set(propertyVals)];
		numberOfDisinctVals = numberOfDisinctVals.filter((d) => {if(!isNaN(d) || (d === 0)){return String(d);}});
		propertyVals = propertyValuesAndID.map((d) => {if(d[1]){return +d[1];}});
		propertyVals.sort(d3.ascending);
		let statistics = [d3.mean(propertyVals),d3.median(propertyVals),d3.quantile(propertyVals,0.25),d3.quantile(propertyVals,0.75),d3.deviation(propertyVals),d3.min(propertyVals),d3.max(propertyVals)];
		let range = [statistics[5],statistics[2],statistics[1],statistics[3],(statistics[3]-statistics[2])*1.5+statistics[1],(statistics[3]-statistics[2])*3+statistics[1],(statistics[3]-statistics[2])*4.5+statistics[1],(statistics[3]-statistics[2])*6+statistics[1]];
		range = [...new Set(range)];
		while(range[range.length-1] > d3.max(propertyVals)){
			range.pop();
		}
		while(range.length >= colours.length + 1){
			range.pop();
		}
		range = range.filter((d) => {if(!isNaN(d) && d!== 0){return d}});
		if(range[range.length-1]>100){
			range = range.map((d) => { return Math.ceil(d / 10) * 10; })
		}else{
			range = range.map((d) => { return Math.ceil( d * 100 )/100; })
		}
		console.log(range,colours);
		let colour = d3.scaleThreshold()
						.domain(range)
						.range(colours);
		propertyValuesAndID.forEach(function(d){
			d3.select('g[map_number=\"'+map_number+'\"] > path[id=\"'+d[0]+'\"]')
				.attr('fill',function(){if(d[1]) { return colour(parseFloat(d[1].replace(',','')) );}else{return unidentifiedColour;}})
				.attr('fill-opacity',1);
		});
		addLegend(map_number, range, false);
	}
	addTooltips(map_number,selectedProperty,propertyValuesAndID);
}

function addLegend(map_number,range,special_var){
	//clearing prev legends
	d3.select('.legend-area[map_number=\"' + map_number + '\"]')
			.html('');


	let colour = d3.scaleThreshold()
		.domain(range)
		.range(colours);

	//container for legends
	let legend_cont = d3.select('.legend-area[map_number=\"' + map_number + '\"]')
		.append('div')
		.attr('class', 'container pt-5 mr-5 mt-5');

	//Adding data unavailable
	 let legend_row = legend_cont.append('div')
						.attr('class','row mt-1')
						.style('max-height','20px')
						.style('overflow-y','hidden');
	
	legend_row.append('div')
		.attr('class', 'col-1 offset-1 p-2')
		.style('background', unidentifiedColour)
		.style('z-index', '5');

	legend_row.append('div')
		.attr('class', 'px-2 pt-0 mt-0 align-selft-start')
		.style('z-index', '5')
		.html(`<p>Data Unavailable</p>`);
			
	if(special_var){
		let classes = Object.keys(range[0]);
		for ( let i = 0;i<classes.length;i++ ) {
			let legend_row = legend_cont.append('div')
				.attr('class', 'row mt-1')
				.style('max-height', () => { if (classes.length > 7) { return '15px' } else { return '20px' } })
				.style('overflow-y', 'hidden');

			legend_row.append('div')
				.attr('class', 'col-1 offset-1 p-2')
				.style('background', range[0][classes[i]])
				.style('z-index', '5');

			legend_row.append('div')
				.attr('class', 'px-2 pt-0 mt-0 align-self-start')
				.style('z-index', '5')
				.style('font-size', ()=>{if(classes.length>7){return '12px'}else{return '15px'}})
				.html(`<p>${classes[i]}</p>`);
		}
		

	}else{
		for (let i = 0; i < range.length; i++) {
			let legend_row = legend_cont.append('div')
				.attr('class', 'row mt-1')
				.style('max-height', '20px')
				.style('overflow-y', 'hidden');

			legend_row.append('div')
				.attr('class', 'col-1 offset-1 p-2')
				.style('background', colours[i])
				.style('z-index', '5');

			legend_row.append('div')
				.attr('class', 'px-2 pt-0 mt-0 align-self-start')
				.style('z-index', '5')
				.html(() => {
					if (i === 0) {
						return `0 - ${range[0]}`
					} else if (i < range.length - 1) {
						return `${range[i]} - ${range[i + 1]}`;
					} else {
						return `${range[i]} and above`;
					}
				});
		}
	}
}

function addTooltips(map_number,selectedProperty,propertyValuesAndID){
	let tooltip = d3.select(".outermost-container").append("div")
	                .attr("class", "tooltip")
					.style("display", "none")
					.style("position", "absolute")
					.style("background", "#faf0af")
					.style("box-shadow", "0px 0px 5px")
					.style("padding", "10px 10px 0px 10px")
					.style("border-radius", "10px");
	propertyValuesAndID.forEach(function(d){
		d3.select('g[map_number=\"'+map_number+'\"] > path[id=\"'+d[0]+'\"]')
			.on("mouseover",function (u){
				tooltip.transition()
				.duration(250)
				.attr("class", "d-block");
				tooltip.html("<p>Name : " + u.properties.NAME + "</p>" + "<p>"+selectedProperty +" : "+d[1] +"</p>")
				.style("left", (d3.event.pageX + 15) + "px")
							.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout",function(){
				tooltip.transition()
				.duration(250)
				.attr("class","d-none");
			})
	});

}

function clearMaps(){
	$('.outermost-container').html('');
}

function capitalizeFirstLetterAndRemoveExtras(string) {
	string = string.replace('_',' ');
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

$('#settingsButton').click(()=>{
	let selected = $("input[type='radio'][name='numMaps']:checked");
	if (selected.length > 0) {
		numMaps = selected.val();
	}
	if(numMaps === "1"){
		clearMaps();
		create_a_map(1,5,1,5,1);
	}else if(numMaps === "2"){
		clearMaps();
		create_a_map(1, 5, 1, 3, 1);
		create_a_map(1, 5, 3, 5, 2);
	} else if (numMaps === "4") {
		clearMaps();
		create_a_map(1, 3, 1, 3, 1);
		create_a_map(1, 3, 3, 5, 2);
		create_a_map(3, 5, 1, 3, 3);
		create_a_map(3, 5, 3, 5, 4);
	}
});

clearMaps();
create_a_map(1,5,1,5,1);
