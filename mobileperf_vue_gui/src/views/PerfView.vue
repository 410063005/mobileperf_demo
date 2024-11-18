<template>

    <div style="display: flex; flex-direction: column; width: 80vw;">
        <div style="display: flex; width: 100%;">
            <PerfChart style="flex: 1;" label-title="FPS" :index-value="2"></PerfChart>
            <PerfChart style="flex: 1;" label-title="内存" :index-value="5" :debug="true" queue-name="mem_queue">
            </PerfChart>
        </div>
        <div style=" display: flex; width: 100%;">
            <PerfChart style="flex: 1;" label-title="流量" :index-value="3" queue-name="traffic_queue">
            </PerfChart>
            <PerfChart style="flex: 1;" label-title="线程" :index-value="3" :debug="true" queue-name="thread_queue">
            </PerfChart>
        </div>
    </div>
</template>
<script setup>

import { onBeforeUnmount } from 'vue';
import PerfChart from '../components/PerfChart.vue';
import { socket } from '@/ws';

onBeforeUnmount(() => {
    socket.disconnect()
})
</script>