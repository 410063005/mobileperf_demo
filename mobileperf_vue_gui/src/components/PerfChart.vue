<template>
    <div>
        <span v-if="props.chartTitle">{{ props.chartTitle }}</span>
        <canvas ref="refChart"></canvas>
    </div>
</template>

<script setup>
import { onActivated, onBeforeUnmount, onMounted, ref, } from 'vue';
import { socket, state } from "@/ws";
import { onBeforeRouteUpdate } from 'vue-router';

const props = defineProps({
    chartTitle: {
        type: String,
        default: ''
    },
    labelTitle: {
        type: String,
        default: '属性'
    },
    queueName: {
        type: String,
        default: 'fps_queue'
    },
    indexTimeSeq: {
        type: Number,
        default: 0
    },
    indexValue: {
        type: Number,
        default: 1,
    },
    debug: {
        type: Boolean,
        default: false
    }
})

let myChart
const refChart = ref(null)

const initChart = () => {

    const config = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: props.labelTitle,
                    data: [],
                    cubicInterpolationMode: 'monotone',
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        duration: 20000,
                        delay: 2000
                    }
                }
            }
        }
    };

    myChart = new Chart(
        refChart.value,
        config
    );
}

function importJs2(event) {
    return new Promise(resolve => {
        api.on(event, response => resolve(response));
    });
}

function importJs(scriptSrc) {
    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.onload = () => {
            resolve()
        }
        document.head.appendChild(script);
    });
}

const updateChart = (data) => {
    if (myChart) {
        myChart.data.datasets[0].data.push({
            x: Date.now(Math.floor(data.data[props.indexTimeSeq] * 1000)),
            y: data.data[props.indexValue],
        });
        myChart.update('quiet');
    }
};

onMounted(async () => {
    socket.connect()
    socket.on(props.queueName, (data) => {
        if (props.debug) {
            console.log(props.queueName, data);
        }
        updateChart(data)
    })

    // XXX Normally we should use npm to import these libraries
    // But it's so complicated cause latest chartjs-plugin-streaming 
    // can't work very well with Vue.js 3
    // We choose cdn js as a workaround
    await Promise.all([
        importJs('https://cdn.jsdelivr.net/npm/chart.js@^3'),
        importJs('https://cdn.jsdelivr.net/npm/luxon@^2'),
        importJs('https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@^1'),
    ])
    importJs('https://cdn.jsdelivr.net/npm/chartjs-plugin-streaming@2.0.0')
        .then(val => {
            console.log('chartjs-plugin-streaming loaded!');
            initChart()
        }).catch(error => {
            console.error(error);
        })
});

onBeforeUnmount(() => {
    socket.removeAllListeners(props.queueName)
    if (myChart) {
        myChart.destroy()
    }
})
</script>

<style></style>