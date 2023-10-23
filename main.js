
const A3_SIZE_X = 420;
const A3_SIZE_Y = 297;
const PRINTABLE_SIZE_X = 400;
const PRINTABLE_SIZE_Y = 275;
const PAGE_OFFSET_X = (A3_SIZE_X-PRINTABLE_SIZE_X)/2;
const PAGE_OFFSET_Y = (A3_SIZE_Y-PRINTABLE_SIZE_Y)/2;
	
const MONTHS_TO_SHOW = 6;

const CELLSIZE_Y = PRINTABLE_SIZE_Y/(32);
const CELLSIZE_X = (PRINTABLE_SIZE_X-CELLSIZE_Y*2)/MONTHS_TO_SHOW;



nicks_leave_ranges = [];

function on_leave(date_current){
	for(let i=0;i<nicks_leave_ranges.length;i++){
		if(date_current.isBetween(moment(nicks_leave_ranges[i].start).subtract(1,"day"),moment(nicks_leave_ranges[i].end).add(1,"day"),"day")){
			return nicks_leave_ranges[i].label;
		}
	}
	return false;
}



window.addEventListener("DOMContentLoaded",function(){

	var draw = SVG('drawing').size( A3_SIZE_X+"mm",A3_SIZE_Y+"mm");
	draw.attr({viewBox:"0 0 "+A3_SIZE_X+" "+A3_SIZE_Y});
	draw = draw.group();
	draw.attr({transform:"translate("+PAGE_OFFSET_X+" "+PAGE_OFFSET_Y+")"})
	//var date_start = moment().add(1,"month").date(1);
	var date_start = moment().date(1);

	var date_current = moment(date_start).subtract(1,"days");
	//console.log("start",date_current.format("YYYY-MM-DD hh:mm:ss"));
	for(let col = 0;col<MONTHS_TO_SHOW;col++){
		for(let row = 0;row<moment(date_current).endOf("month").date();row++){
			date_current.add(1,"days");
			//console.log(date_current.format("YYYY-MM-DD hh:mm:ss"));
			let nrect = draw.rect(CELLSIZE_X,CELLSIZE_Y)
				.move(CELLSIZE_Y+CELLSIZE_X*col,(row+1) * CELLSIZE_Y)
				.stroke({color:"#000000",width:0.2});
			
			let day_format = get_day_format(date_current);
			nrect.fill(day_format.fill_color);
			if(day_format.label){
				draw.plain(day_format.label).fill("#503c4d").attr({"text-anchor":"middle","font-size":CELLSIZE_Y/2}).move(CELLSIZE_Y+CELLSIZE_X*col+CELLSIZE_X/2,(row+1) * CELLSIZE_Y+CELLSIZE_Y/4);
			}
			//draw.plain(row+1).fill("#EEEEEE").attr({"text-anchor":"middle","font-size":CELLSIZE_Y-2}).move(CELLSIZE_Y/2,(row+1)*CELLSIZE_Y);
		}
	}
	
	
	// === Draw day labels
	for(let row = 0;row<31;row++){
		draw.rect(CELLSIZE_Y,CELLSIZE_Y).fill("#888888").move(0,(row+1) * CELLSIZE_Y).stroke({color:"#000000",width:0.3});
		draw.plain(row+1).fill("#EEEEEE").attr({"text-anchor":"middle","font-size":CELLSIZE_Y-2}).move(CELLSIZE_Y/2,(row+1)*CELLSIZE_Y+1);
		draw.rect(CELLSIZE_Y,CELLSIZE_Y).fill("#888888").move(PRINTABLE_SIZE_X-CELLSIZE_Y,(row+1) * CELLSIZE_Y).stroke({color:"#000000",width:0.3});
		draw.plain(row+1).fill("#EEEEEE").attr({"text-anchor":"middle","font-size":CELLSIZE_Y-2}).move(PRINTABLE_SIZE_X-CELLSIZE_Y+CELLSIZE_Y/2,(row+1)*CELLSIZE_Y+1);
	}
	
	
	// === Draw month labels
	var date_current = moment(date_start);
	for(let col = 0;col<MONTHS_TO_SHOW;col++){
		draw.rect(CELLSIZE_X,CELLSIZE_Y)
			.fill("#888888")
			.move(col*CELLSIZE_X+CELLSIZE_Y,0).stroke({color:"#000000",width:0.3});
		draw.plain(date_current.format("MM MMM YYYY"))
			.fill("#EEEEEE")
			.attr({"text-anchor":"middle","font-size":CELLSIZE_Y/2})
			.move(col*CELLSIZE_X+CELLSIZE_Y+CELLSIZE_X/2,CELLSIZE_Y/4);
		date_current.add(1,"M");
	}
	alert("Calendar generated successfully. close this popup then press Ctrl+E to download a PDF version for printing")
},false);

function get_day_format(date_current){
	var output = {fill_color:"#FFFFFF",label:"",label_color:"#503c4d"};
	let pub = in_public_holidays(date_current);
	let lev = on_leave(date_current);
	let weekend = date_current.isoWeekday() > 5
	if(weekend) output.fill_color = "#AAAAAA";
	if(lev && !weekend){
		output.fill_color = "#e4c895";
		output.label_color = "#4a3207";
		output.label = lev;
	}
	if(pub){
		output.fill_color = "#e0b7d9";
		output.label_color = "#503c4d";
		output.label = pub.short_name;
	}
	return output;
}

function download() {
	let filename = "calendar.svg";
	let data = document.querySelector("svg").outerHTML;
    let blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}
window.addEventListener("keydown",function(e){
	if(e.key=="d") download();
});


function download_pdf() {
	let filename = "calendar.pdf";
	let data = document.querySelector("svg").outerHTML;
    

	
	let doc = new PDFDocument({
		size:"A3",
		layout:"landscape"
	});
	
	let stream = doc.pipe(blobStream());
	
	SVGtoPDF(doc,data,0,0,{});
	
	
	doc.end();
	stream.on('finish', function() {
		// get a blob you can do whatever you like with
		let blob = stream.toBlob('application/pdf');

		// or get a blob URL for display in the browser
		//const url = stream.toBlobURL('application/pdf');
		//iframe.src = url;

		if(window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveBlob(blob, filename);
		}else{
			let elem = window.document.createElement('a');
			elem.href = window.URL.createObjectURL(blob);
			elem.download = filename;        
			document.body.appendChild(elem);
			elem.click();        
			document.body.removeChild(elem);
		}
	});
	
    
}
window.addEventListener("keydown",function(e){
	if(e.key=="e") download_pdf();
})