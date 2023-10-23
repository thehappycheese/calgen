var final_public_holidays = [];
function first_weekday_after(weekday,m){
	while(m.isoWeekday()!==1){
		m.add(1,"d");
	}
	return m;
}
var public_holidays_constant = [
	{month:01-1, date:01, full_name:"New Years Day",    short_name:"NEW Y"},
	{month:01-1, date:26, full_name:"Australia Day",    short_name:"AUST"},
	{month:03-1, date:01, full_name:"Labour Day",	    short_name:"LAB"},
	{month:04-1, date:25, full_name:"ANZAC Day",		short_name:"ANZAC"},
	{month:12-1, date:25, full_name:"Christmas Day",    short_name:"XMAS"},
	{month:12-1, date:26, full_name:"Boxing Day",	    short_name:"BOX"},
];
var public_holidays_easter = [
	moment([2018,04-1,01]),
	moment([2019,04-1,21]),
	moment([2020,04-1,12]),
	moment([2021,04-1,04]),
	moment([2022,04-1,17]),
	moment([2023,04-1,09]),
	moment([2024,03-1,31]),
	moment([2025,04-1,20]),
	moment([2026,04-1,05]),
];
var public_WA_day = [
	
	{year:2023, date:first_weekday_after(1, moment([2023,06-1,5])), short_name:"WA DAY", full_name:"Western Australia Day"},
	{year:2024, date:first_weekday_after(1, moment([2024,06-1,3])), short_name:"WA DAY", full_name:"Western Australia Day"},
	{year:2025, date:first_weekday_after(1, moment([2025,06-1,2])), short_name:"WA DAY", full_name:"Western Australia Day"}
];
var public_holiday_queens_bday = [
	
	{year:2023, date:moment([2023,09-1,25]), short_name:"Q BDAY - date tba", full_name:"Queen's Birthday - date TBA"}, // unknown
	{year:2024, date:moment([2024,09-1,23]), short_name:"Q BDAY - date tba", full_name:"Queen's Birthday - date TBA"}, // unknown
	{year:2025, date:moment([2025,09-1,29]), short_name:"Q BDAY - date tba", full_name:"Queen's Birthday - date TBA"} // unknown
];


let special_extra_days = [];
function in_extra_days (m){
	for(let i =0;i<special_extra_days.length;i++){
		if(special_extra_days[i].format("YYYY-MM-DD") == m.format("YYYY-MM-DD")){
			return true;
		}
	}
	return false;
}
function get_next_suitable_day(arg_m){
	let flag = false;
	m = moment(arg_m);
	while(m.isoWeekday()>5 || in_extra_days(m) || in_public_holidays(m)){
		flag = true;
		m.add(1,"d");
	}
	if(flag){
		special_extra_days.push(m.clone());
	}
	return m;
}
function in_public_holidays (m){
	for(let i =0;i<final_public_holidays.length;i++){
		if(final_public_holidays[i].date.format("YYYY-MM-DD") == m.format("YYYY-MM-DD")){
			return final_public_holidays[i];
		}
	}
	return false;
}
public_holidays_easter.map((item)=>{
	final_public_holidays.push({year:item.year(), date:moment(item).subtract(2,"d"),			short_name:"G FRI",	full_name:"Good Friday"});
	//final_public_holidays.push({year:item.year(), date:moment(item).add(1,"d"),	short_name:"EASTR",	full_name:"Easter Saturday"});
	//final_public_holidays.push({year:item.year(), date:moment(item).add(2,"d"),	short_name:"EASTR",	full_name:"Easter Sunday"});
	final_public_holidays.push({year:item.year(), date:moment(item).add(1,"d"),	short_name:"ESTR M",	full_name:"Easter Monday"});
	return item;
});
final_public_holidays=final_public_holidays.concat(public_holiday_queens_bday);
final_public_holidays=final_public_holidays.concat(public_WA_day);
for(let year = 2018;year<2025;year++){
	// easter days
	
	// fixed dates
	for(let j =0;j<public_holidays_constant.length;j++){
		final_public_holidays.push({
			year:year,
			date:get_next_suitable_day(moment([year,public_holidays_constant[j].month,public_holidays_constant[j].date])),
			short_name:public_holidays_constant[j].short_name,
			full_name:public_holidays_constant[j].full_name
		});
	}
	
}
final_public_holidays.sort((a,b)=>a.date-b.date);