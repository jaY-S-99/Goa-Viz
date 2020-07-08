const map = {
    c_unit_map_2011: "./Maps/ga_s.json",
    c_unit_map_2001: "./Maps/Goa_2001.json",
    c_unit_map_1991: "./Maps/Goa_1991.json",
    pernem: "./Maps/Pernem.json",
    bardez: "./Maps/Bardez.json",
    ponda: "./Maps/Ponda.json",
    sanguem: "./Maps/Sanguem.json",
    satari: "./Maps/Satari.json",
    bicholim: "./Maps/Bicholim.json",
    canacona: "./Maps/Canacona.json",
    quepem: "./Maps/Quepem.json",
    salcete: "./Maps/Salcete.json",
    tiswadi: "./Maps/Tiswadi.json",
    darbandora: "./Maps/Darbandora.json",
    mormugao: "./Maps/Mormugao.json",
    vp_final: "./Maps/VP_Goa_map.json"
};
const data = {
    c_unit_map_2011: "./data/Database.csv",
    c_unit_map_2001: "./data/Cen_2001.csv",
    c_unit_map_1991: "./data/Cen_1991.csv",
    vp_final: "./data/VP_data.csv",
    pernem: "./data/Pernem_data.csv",
    bardez: "./data/Bardez_data.csv",
    ponda: "./data/Ponda_data.csv",
    sanguem: "./data/Sanguem_data.csv",
    satari: "./data/Satari_data.csv",
    bicholim: "./data/Bicholim_data.csv",
    canacona: "./data/Canacona_data.csv",
    quepem: "./data/Quepem_data.csv",
    salcete: "./data/Salcete_data.csv",
    tiswadi: "./data/Tiswadi_data.csv",
    darbandora: "./data/Darbandora_data.csv",
    mormugao: "./data/Mormugao_data.csv",
}
const starting_pos_vp = {
    "Bardez": 0,
    "Bicholim": 34,
    "Canacona": 53,
    "Darbandora": 61,
    "Mormugao": 66,
    "Pernem": 70,
    "Ponda": 91,
    "Quepem": 110,
    "Salcete": 123,
    "Satari": 157,
    "Tiswadi": 170,
    "Sanguem": 190
}

//This constants store the number of maps and the corresponding data in the format " map_code || display_name || data_location"
const c_maps = [['c_unit_map_2011', 'Census 2011'], ['c_unit_map_2001', 'Census 2001'], ['c_unit_map_1991', 'Census 1991']];
const vp_maps = [['vp_final', 'Village Panchayat Map'],
['pernem', 'Pernem'],
['bardez', 'Bardez'],
['ponda', 'Ponda'],
['sanguem', 'Sanguem'],
['satari', 'Satari'],
['bicholim', 'Bicholim'],
['canacona', 'Canacona'],
['quepem', 'Quepem'],
['salcete', 'Salcete'],
['tiswadi', 'Tiswadi'],
['darbandora', 'Darbandora'],
['mormugao', 'Mormugao']];
const discarded_properties = ['State', 'District', 'Subdistt', 'Village', 'Town/Village', 'Ward', 'EB', 'Level', 'Name', 'TRU', 'ID', 'STATE', 'DISTRICT', 'SUB-DISTT', 'TOWN_VILL', 'WARD', 'LEVEL', 'NAME', 'VP/MC'];
const colours = ["#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"];
const special_vars = {
    // [[Special Colour Scheme],[Type of display],[Legend Names and colours]]
    'Class': [[{ "VI": "#fec44f", "V": "#fe9929", "IV": "#ec7014", "III": "#cc4c02", "II": "#993404", "I": "#662506", "D": "#A1D39A", "C": "#6CC160", "B": "#408737", "A": "#156609" }], 'Categorical', [{ "Urban VI": "#fec44f", "Urban V": "#fe9929", "Urban IV": "#ec7014", "Urban III": "#cc4c02", "Urban II": "#993404", "Urban I": "#662506", "Rural D": "#A1D39A", "Rural C": "#6CC160", "Rural B": "#408737", "Rural A": "#156609" }]],
    'Urb_Under_MC/VP': [[{ "MCI": "#fe9929", "VP": "#6CC160" }], 'Categorical', [{ "MCI": "#fe9929", "VP": "#6CC160" }]]
}
const unidentifiedColour = "#ededed";
