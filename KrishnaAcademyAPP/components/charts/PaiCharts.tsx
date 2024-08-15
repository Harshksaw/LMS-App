import { PieChart } from "react-native-gifted-charts";
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

 const PieCharts = ({pieData, total}: any) => {
 console.log("🚀 ~ PieCharts ~ pieData:", pieData)
 console.log(pieData, 'piecharts ----------->')
const answered = pieData[0].value

const Incorrect = pieData[1].value
const unanswered = pieData[2].value
const pieDsata = [
    {value: pieData[0].value, color: '#177AD5', text: '54%'},
    {value:pieData[1].value, color: '#79D2DE', text: '30%'},
    {value: pieData[2].value, color: '#ED6665', text: '26%'},
];
  const renderDot = (color : any) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            {renderDot('#006DFF')}
            <Text style={styles.legendText}>Answered: {pieData[0].value}</Text>
          </View>
          <View style={styles.legendItem}>
            {renderDot('#ED6665')}
            <Text style={styles.legendText}>Unanswered: {pieData[2].value}</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            {renderDot('#79D2DE')}
            <Text style={styles.legendText}>Incorrect: {pieData[1].value}</Text>
          </View>
        
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Performance</Text>
        <View style={styles.chart}>
          <PieChart
            data={pieDsata}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={'#232B5D'}
            centerLabelComponent={() => {
              const answeredPercentage = ((answered / (answered + unanswered + Incorrect)) * 100).toFixed(2);
    return (
      <View style={styles.centerLabel}>
        <Text style={styles.centerLabelText}>{answeredPercentage}%</Text>
        <Text style={styles.centerLabelSubText}>Answered</Text>
      </View>
              );
            }}
          />
        </View>
        {renderLegendComponent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 100,
    backgroundColor: '#f3f3f3',
    // flex: 1,
  },
  chartContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#232B5D',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chart: {
    padding: 20,
    alignItems: 'center',
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  centerLabelSubText: {
    fontSize: 14,
    color: 'white',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    marginRight: 20,
  },
  legendText: {
    color: 'white',
  },
});

export default PieCharts;