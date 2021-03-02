let genderArray = [];
let numberBasedOnGender = [];

window.addEventListener('load',function(){
    const svg = d3.select('body').append('svg')
    .attr('width',500)
    .attr('height',600)
    .attr('id','svgMain');

    d3.json("attendancedata.json").then(function(data){
        //if (error){return console.warn(error);} 

        let attendanceData = data.attendanceData;

        for (let i=0; i<attendanceData.length; i++){
            let studentDetails =  attendanceData[i];
            for (const key in studentDetails) {
                //console.log(`${key}: ${studentDetails[key]}`);
                //const propertyId = Object.keys(studentDetails);
                let [id,gender] = [studentDetails.ID,studentDetails.Gender];
                genderArray.push({id,gender});
            }  
        }
        const uniqueGenderSet = new Set(genderArray.map(e => JSON.stringify(e)));
        const uniqueGenderArray = Array.from(uniqueGenderSet).map(e => JSON.parse(e));
        
        //console.log(genderArray.length);
        console.log(uniqueGenderArray);

        let genderCount = [];
        for (let i = 0; i < uniqueGenderArray.length; i++) {
            let num = uniqueGenderArray[i].gender;
            genderCount[num] = genderCount[num] ? genderCount[num]+1 : 1;
        }
        console.log(genderCount);

        for (const key in genderCount) {
            numberBasedOnGender.push({'key':key, 'value': genderCount[key]});
        } 
        
        
        //Get the total count for males and females for the yAxis
        const maxY = d3.max(numberBasedOnGender.map(function(d){return d.value;}));
        console.log(numberBasedOnGender);
        //console.log(maxY);
        const xScale = d3.scaleBand().domain(numberBasedOnGender.map((d)=>d.key))
                .range([100,400]).padding(0.1);
        const yScale = d3.scaleLinear().domain([0,maxY+2000]).range([500,50]);

        const xAxsi = d3.axisBottom().scale(xScale);
        const yAxsi = d3.axisLeft().scale(yScale);

        svg.selectAll('bar')
        .data(numberBasedOnGender)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width',xScale.bandwidth())
        .attr('height',(d)=>500-yScale(d.value))
        .attr('x',(d)=>xScale(d.key))
        .attr('fill-opacity',"50%")
        .attr('y',(d)=>yScale(d.value));

        //call axis 
        d3.select("svg").append("g").attr('transform','translate(0,500)').call(xAxsi);
        d3.select("svg").append("g").attr('transform','translate(100,0)').call(yAxsi);

    });

});