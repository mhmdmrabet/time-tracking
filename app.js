Vue.createApp({
  data() {
    return {
      title: "Time Tracking",
      logoSource: "https://cdn.svgporn.com/logos/vue.svg",
      taskName: "",
      isTaskInProgress: false,
      startTime: null,
      errorMsg: null,
    };
  },
  methods: {
    startTask() {
      // Verify
      if (!this.taskName) {
        this.errorMsg = "Task name cannot be empty.";
        return;
      } else if (this.isTaskInProgress) {
        this.errorMsg = "A task is already in progress.";
        return;
      } else {
        this.errorMsg = null;
      }
      // Task
      this.isTaskInProgress = true;
      this.startTime = Date.now();
    },
    stopTask() {
      this.isTaskInProgress = false;
      this.errorMsg = null;
    },
  },
}).mount("#app");
