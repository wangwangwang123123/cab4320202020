import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import d3Cloud from "d3-cloud";


const WordCloud = ({ data }) => {
	const [cloud, setCloud] = useState(null);
	const margin = { top: 30, right: 50, bottom: 30, left: 50 };
	const width = 800 - margin.left - margin.right;
	const height = 600 - margin.top - margin.bottom;

	useEffect(() => {
	  const fontSize = d3
		.scalePow()
		.exponent(5)
		.domain([0, 1])
		.range([40, 80]);
  
	  // Adds a set of variables to each element in the data (we will use x and y later)
	  d3Cloud()
		.size([width, height])
		.timeInterval(20)
		.words(data)
		//.rotate(function(d) { return 0; })
		.rotate(function() {
		  // ~~(n) returns floor if n < 0, ceil if n>=0
		  return ~~(Math.random() * 2) * 90;
		})
		.fontSize(function(d, i) {
		  return fontSize(Math.random());
		})
		.fontWeight(["bold"])
		.text(function(d) {
			return d.word;
		  })
		.on("end", words => setCloud(words))
		.start();
	}, [data, width, height]);
  
	console.log(data);
	console.log(cloud ? cloud : null);
  
	var color = d3.scaleOrdinal(d3.schemePastel1);
  
	return (
	  <svg width={800} height={600}>
		<g transform={`translate(${margin.left},${margin.top})`}>
		  <g transform={`translate(${width / 2},${height / 2})`}>
			{cloud &&
			  cloud.map((word, i) => (
				<text
				  key={word.text}
				  style={{
					fill: color(i),
					fontSize: word.size + "px",
					fontFamily: word.font
				  }}
				  textAnchor="middle"
				  transform={`translate(${word.x},${word.y}) rotate(${
					word.rotate
				  })`}
				>
				  {word.text}
				</text>
			  ))}
		  </g>
		</g>
	  </svg>
	);
  };
  export default WordCloud;
