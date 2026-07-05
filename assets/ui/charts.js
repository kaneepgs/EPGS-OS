const palette = {
  cyan: '#7dd3fc',
  blue: '#60a5fa',
  teal: '#2dd4bf',
  green: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  slate: '#93a4bd',
  surface: 'rgba(255,255,255,0.05)',
  grid: 'rgba(148,163,184,0.12)'
};

let activeCharts = [];

function baseOptions(type = 'line') {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: 'easeOutQuart' },
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: {
        display: type === 'doughnut',
        labels: { color: '#cdd8e8', usePointStyle: true, boxWidth: 10 }
      },
      tooltip: {
        backgroundColor: 'rgba(10,16,28,0.95)',
        titleColor: '#f8fbff',
        bodyColor: '#cdd8e8',
        borderColor: 'rgba(125,211,252,0.18)',
        borderWidth: 1,
        padding: 12,
        displayColors: true
      }
    },
    scales: type === 'doughnut'
      ? {}
      : {
          x: {
            ticks: { color: '#93a4bd' },
            grid: { color: 'transparent' },
            border: { color: palette.grid }
          },
          y: {
            ticks: { color: '#93a4bd' },
            grid: { color: palette.grid },
            border: { color: palette.grid }
          }
        }
  };
}

function chartConfig(type, entry) {
  if (type === 'line') {
    return {
      type,
      data: {
        labels: entry.labels,
        datasets: [
          {
            label: entry.label || 'Value',
            data: entry.values,
            borderColor: palette.cyan,
            backgroundColor: 'rgba(125,211,252,0.18)',
            borderWidth: 3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.34
          }
        ]
      },
      options: baseOptions(type)
    };
  }

  if (type === 'bar') {
    return {
      type,
      data: {
        labels: entry.labels,
        datasets: [
          {
            label: entry.label || 'Value',
            data: entry.values,
            backgroundColor: [palette.cyan, palette.blue, palette.teal, palette.amber, palette.rose, palette.green],
            borderRadius: 10,
            borderSkipped: false
          }
        ]
      },
      options: baseOptions(type)
    };
  }

  if (type === 'doughnut') {
    return {
      type,
      data: {
        labels: entry.labels,
        datasets: [
          {
            label: entry.label || 'Value',
            data: entry.values,
            backgroundColor: [palette.cyan, palette.blue, palette.teal, palette.amber, palette.rose, palette.green],
            borderColor: 'rgba(7,16,26,1)',
            borderWidth: 4,
            hoverOffset: 6
          }
        ]
      },
      options: {
        ...baseOptions(type),
        cutout: type === 'doughnut' ? '72%' : 0
      }
    };
  }

  return null;
}

export function renderCharts(specs = []) {
  destroyCharts();
  if (!globalThis.Chart) return;

  specs.forEach((spec) => {
    const canvas = document.getElementById(spec.id);
    if (!canvas) return;
    const config = chartConfig(spec.type, spec);
    if (!config) return;
    const chart = new globalThis.Chart(canvas.getContext('2d'), config);
    activeCharts.push(chart);
  });
}

export function destroyCharts() {
  activeCharts.forEach((chart) => chart.destroy());
  activeCharts = [];
}
