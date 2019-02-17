import React, { PureComponent } from "react";
import countBy from "lodash.countby";
import "./Summary.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Sector,
  Cell
} from "recharts";

class Summary extends PureComponent {
  componentDidMount() {
    this.props.getRepository(null, "OPEN", "summary");
    this.props.getRepository(null, "MERGED", "summary");
    this.props.getRepository(null, "DECLINED", "summary");
    this.props.getToken();
  }
  //data for pie chart
  getDataforChart(status) {
    let data = "";
    if (status === "open") {
      data = this.props.summaryData.totalOpen.flat();
    } else if (status === "declined") {
      data = this.props.summaryData.totalMerged.flat();
    } else if (status === "merged") {
      data = this.props.summaryData.totalDeclined.flat();
    }

    const namesData = data.map(user =>
      user.author ? user.author.display_name : ""
    );

    const countedName = countBy(namesData);

    const newobject = Object.keys(countedName).map(objectKey => {
      let key = objectKey;
      let value = countedName[objectKey];
      return {
        name: key,
        value: value
      };
    });
    return newobject;
  }

  render() {
    const openForChart = this.getDataforChart("open");
    console.log("openForChart", openForChart);
    const mergedForChart = this.getDataforChart("merged");
    const declinedForChart = this.getDataforChart("declined");

    //pie chart
    const COLORS = ["#0088FE", "#00C49F"];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent, index,
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="black"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <div className="allGraphs">
        <div className="summary-firstGraph">
          <BarChart
            width={800}
            height={600}
            data={[
              {
                name: "Open",
                qty: this.props.summaryData.open
              },
              {
                name: "Merged",
                qty: this.props.summaryData.merged
              },
              {
                name: "Decline",
                qty: this.props.summaryData.declined
              }
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              minPointSize={10}
              label={{ fill: "#979797", fontSize: 20, position: "right" }}
              stroke="#8884d8"
              barSize={50}
              dataKey="qty"
              fill="#82ca9d"
            />
          </BarChart>
        </div>
        <div className="summary-secondGraph">
          <PieChart width={800} height={400}>
            <Pie
              openForChart={openForChart}
              cx={400}
              cy={500}
              outerRadius={80}
              labelLine={false}
              label={renderCustomizedLabel}
              fill="#8884d8"
              dataKey="value"
            >
              {openForChart.map((entry, index) => (
                <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]} />
                )
              )}
            </Pie>
          </PieChart>
        </div>
      </div>
    );
  }
}

export default Summary;
