import * as d3 from "d3";
import { scaleTime, timeThursday } from "d3";
import { scaleLinear } from "d3";

class AndamentoTempo {
  constructor(mountPoint = "body", opt) {
    this.defaults = {
      width: 500,
      height: 200,
      margin: 40,
      padding: 40,
      lineOpacity: 0.25,
      lineOpacityHover: 0.85,
      otherLinesOpacityHover: 0.1,
      lineStroke: "1.5px",
      lineStrokeHover: "2.5px",
      circleOpacity: 0.85,
      circleOpacityOnLineHover: 0.25,
      circleRadius: 6,
      circleRadiusHover: 10,
      duration: 1000,
      colors: ["#4C5454", "#FF715B", "#1EA896", "#DBD56E", "#403D58"]
    };

    for (const [key, value] of Object.entries(opt)) {
      this.defaults[key] = value;
    }
    /* Add SVG */
    this.svg = d3
      .select(mountPoint)
      .append("svg")
      .attr("width", this.defaults.width + this.defaults.margin + "px")
      .attr("height", this.defaults.height + this.defaults.margin + "px")
      .append("g")
      .attr(
        "transform",
        `translate(${this.defaults.margin}, ${this.defaults.margin})`
      );

    this.svg
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        `translate(0, ${this.defaults.height - this.defaults.margin})`
      );

    this.svg
      .append("g")
      .attr("class", "y axis");

    this.svg
      .append("g")
      .attr("id", "spezzate");

    this.svg
      .append("g")
      .attr("id", "cerchi");
  }

  parseDate(giorno) {
    return d3.timeParse("%Y-%m-%d")(giorno);
  }

  creaDati(data) {
    let etichette = [];
    let giorniUniti = [];
    let valori = [];

    data.map(livello1 => {
      etichette.push({ nome: livello1.name });
      valori.push(livello1.values);
      livello1.values.map(livello2 => giorniUniti.push(livello2.giorno));
    });
    let giorni = [...new Set(giorniUniti.map(item => item))];
    return {
      etichette: etichette,
      valori: valori,
      giorni: giorni.map(o => this.parseDate(o))
    };
  }

  xScale(data) {
    return d3
      .scaleTime()
      .domain(d3.extent(data))
      .range([0, this.defaults.width - this.defaults.margin]);
  }

  yScale(data) {
    const yMax = data.valori.reduce((pv, cv) => {
      const currentMax = cv.reduce((pv, cv) => Math.max(pv, cv.valore), 0);
      return Math.max(pv, currentMax);
    }, 0);
    return d3
      .scaleLinear()
      .domain([0, yMax])
      .range([this.defaults.height - this.defaults.margin, 0]);
  }

  updateXAxis(data) {
    var xAxis = d3
      .axisBottom(this.xScale(data))
      .tickFormat(d3.timeFormat("%d-%m"))
      .tickValues(data.giorni);
    this.svg
      .select(".x.axis")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.5em")
      .attr("transform", "rotate(-90)")
      .style("opacity", 0)
      .transition()
      .duration(this.defaults.duration)
      .style("opacity", 1);
  }

  updateYAxis(data) {
    let y_axis = d3.axisLeft(this.yScale(data)).ticks(5);
    this.svg
      .selectAll(".y.axis")
      .transition()
      .duration(this.defaults.duration)
      .call(y_axis);
  }

  faiSpezzata(data) {
    return d3
      .line()
      .x(d => {
        return this.xScale(data.giorni)(d.giorno);
      })
      .y(d => {
        return this.yScale(data)(d.valore);
      });
  }

  updateCerchi(data) {

    const cerchiGroup = this.svg.select("#cerchi").selectAll(".circle-group")
      .data(data.valori)
      .attr("class", "circle-group");

    cerchiGroup
      .exit()
      .remove();

    cerchiGroup.enter()
      .append("g")
      .attr("class", "circle-group")
      .attr("data-chiave", (d,i) => i)
      .attr("fill", (d, i) => this.defaults.colors[i])
      .merge(cerchiGroup)
      .selectAll("circle")
      .data(d => d)
      .enter()
      .append("g")
      .attr("class", "circle")
      .attr("data-chiave", (d,i) => i)
      .append("circle")
      .style("opacity",0)
      .attr("cx", d => this.xScale(data.giorni)(d.giorno))
      .attr("cy", d => this.yScale(data)(d.valore))
      .attr("r", this.defaults.circleRadius)
      .transition()
      .duration(this.defaults.duration / 4)
      .delay(this.defaults.duration / 4)
      .style('opacity',1);

    d3.selectAll(".circle")
      .on("mouseover", (d, i, nodes) => {
        d3.select(nodes[i])
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.valore}`)
          .attr("x", d => this.xScale(data.giorni)(d.giorno) + 5)
          .attr("y", d => this.yScale(data)(d.valore) - 10);
      })
      .on("mouseout", (d, i, nodes) => {
        d3.select(nodes[i])
          .style("cursor", "none")
          .selectAll(".text")
          .remove();
      });

    d3.selectAll("circle")
      .on("mouseover", (d, i, nodes) => {
        d3.select(nodes[i])
          .transition()
          .duration(this.defaults.duration / 4)
          .attr("r", this.defaults.circleRadiusHover);
      })
      .on("mouseout", (d, i, nodes) => {
        d3.select(nodes[i])
          .transition()
          .duration(this.defaults.duration / 4)
          .attr("r", this.defaults.circleRadius);
      });
  }

  updateGrafico(data) {
    const yAxis = d3.axisLeft().scale(this.yScale(data));
    // if no axis exists, create one, otherwise update it
    this.svg
      .selectAll(".y.axis")
      .transition()
      .duration(1500)
      .call(yAxis);

    // generate line paths
    const lines = this.svg
      .select("#spezzate")
      .selectAll(".line")
      .data(data.valori)
      .attr("class", "line");

    // exit
    lines
      .exit()
      .transition()
      .duration(this.defaults.duration / 4)
      .attr("stroke-dashoffset", function(d) {
        return this.getTotalLength();
      })
      .remove();

    // enter any new data
    lines
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", this.faiSpezzata(data))
      .style("stroke", (d, i) => this.defaults.colors[i])
      // Update new data
      .attr("stroke-dasharray", function(d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function(d) {
        return this.getTotalLength();
      })
      .merge(lines)
      .transition()
      .duration(this.defaults.duration)
      .attr("d", this.faiSpezzata(data))
      .style("stroke", (d, i) => this.defaults.colors[i])
      .attr("stroke-dashoffset", 0);
  }

  render(data) {
    let nuoviDati = this.creaDati(data);

    data.forEach(d => {
      d.values.forEach(d => {
        d.giorno = this.parseDate(d.giorno);
        d.valore = +d.valore;
      });
    });

    if (
      d3
        .select(".x.axis")
        .selectAll(".tick")
        .empty()
    ) {
      this.updateXAxis(nuoviDati.giorni);
    }
    this.updateCerchi(nuoviDati);
    this.updateGrafico(nuoviDati);
  }

  render_old(data) {
    const width = 960;
    const height = 500;

    const margin = { top: 20, right: 20, bottom: 20, left: 50 };

    const svg = this.svg;

    const xScale = d3
      .scaleLinear()
      .range([0, width - margin.left - margin.right]);

    const yScale = d3
      .scaleLinear()
      .range([height - margin.top - margin.bottom, 0]);

    const line = d3
      .line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    function newData(lineNumber, numPoints) {
      return d3.range(lineNumber).map(() =>
        d3.range(numPoints).map((item, index) => ({
          x: index / (numPoints - 1),
          y: Math.random() * 100
        }))
      );
    }

    function render() {
      // generate new data
      const data = newData(4, 4);

      // obtain absolute min and max
      const yMin = data.reduce((pv, cv) => {
        const currentMin = cv.reduce((pv, cv) => Math.min(pv, cv.y), 100);
        return Math.min(pv, currentMin);
      }, 100);
      const yMax = data.reduce((pv, cv) => {
        const currentMax = cv.reduce((pv, cv) => Math.max(pv, cv.y), 0);
        return Math.max(pv, currentMax);
      }, 0);

      // set domain for axis
      yScale.domain([yMin, yMax]);

      // create axis scale
      const yAxis = d3.axisLeft().scale(yScale);

      // if no axis exists, create one, otherwise update it
      if (svg.selectAll(".y.axis").empty()) {
        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis);
      } else {
        svg
          .selectAll(".y.axis")
          .transition()
          .duration(1500)
          .call(yAxis);
      }

      // generate line paths
      const lines = svg
        .selectAll(".line")
        .data(data)
        .attr("class", "line");

      // exit
      lines.exit().remove();

      // enter any new data
      lines
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", line)
        .style(
          "stroke",
          () => "#" + Math.floor(Math.random() * 16777215).toString(16)
        )
        // Update new data
        .merge(lines)
        .transition()
        .duration(1500)
        .attr("d", line)
        .style(
          "stroke",
          () => "#" + Math.floor(Math.random() * 16777215).toString(16)
        );

      //   // transition from previous paths to new paths
      //   lines.transition().duration(1500)
      //     .attr("d",line)
      //     .attr("stroke", () =>
      //       '#' + Math.floor(Math.random() * 16777215).toString(16)
      //     );
    }

    // initial page render
    render();

    // continuous page render
    setInterval(render, 1500);
  }
}

export default AndamentoTempo;
