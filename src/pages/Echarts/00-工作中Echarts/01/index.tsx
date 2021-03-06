import React, {
  useState,
  useEffect,
  createRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { CSSProperties } from 'react';
import chartConfig from './chartConfig';

import * as echarts from 'echarts';
// // 引入 ECharts 主模块
// import echarts from 'echarts/lib/echarts';
// // 引入柱状图
// import 'echarts/lib/chart/bar';
// // 引入折线图
// import 'echarts/lib/chart/line';
// // 引入图例、提示框和标题组件
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';

interface ChartProps {
  xData?: any[]; // x轴值
  yIncrement?: any[]; // y轴增量数据
  yTotal?: any[]; // y轴总量数据
  intervalNum?: number; // 可选值:y轴正轴分割的段数 默认为5
  loading?: boolean;

  style?: CSSProperties;
  className?: string | undefined;
}

export interface RefCurrent {
  echarts?: echarts.ECharts;
}

const Chart = forwardRef<RefCurrent, ChartProps>((props, ref) => {
  const {
    xData = [],
    yIncrement = [],
    yTotal = [],
    intervalNum = 5,
    loading,
    ...DivProps
  } = props;

  const echartsRef = createRef<HTMLDivElement>();

  const [myChart, setMyChart] = useState<echarts.ECharts>();
  // const eChart;

  useEffect(() => {
    let echResize: () => void;
    if (echartsRef.current) {
      // 初始化
      const myChart = echartsRef.current && echarts.init(echartsRef.current);
      myChart.setOption(chartConfig(xData, yIncrement, yTotal, intervalNum));
      setMyChart(myChart);

      // 加载状态
      if (loading) {
        myChart.showLoading('default', {
          text: '',
          color: '#FF7FBA',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.3)',
        });
      } else {
        myChart.hideLoading();
      }
      // 监听边框大小是否发送变化修改 echarts
      echResize = () => myChart.resize();
      window.addEventListener('resize', echResize);
    }
    // 移除监听
    return () => {
      if (echResize) window.removeEventListener('resize', echResize);
    };
  }, [echartsRef.current, xData, yIncrement, yTotal, intervalNum, loading]);

  // 导出ref
  useImperativeHandle(ref, () => ({
    echarts: myChart,
  }));

  return <div ref={echartsRef} {...DivProps}></div>;
});

export default Chart;
