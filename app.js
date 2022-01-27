Vue.createApp({
  data() {
    return {
      title: "Time Tracking",
      logoSource: "https://cdn.svgporn.com/logos/vue.svg",
      tasks: [],
      taskId: 0,
      taskName: "",
      isTaskInProgress: false,
      startTime: null,
      errorMsg: null,
    };
  },
  methods: {
    // * START
    startTask() {
      // Verification
      if (!this.taskName) {
        this.errorMsg = "Task name cannot be empty.";
        return;
      } else if (this.isTaskInProgress) {
        this.errorMsg = "A task is already in progress.";
        return;
      } else {
        this.errorMsg = null;
      }
      // Start task
      this.isTaskInProgress = true;
      this.startTime = Date.now();
    },
    // * STOP
    stopTask() {
      // Verification
      if (!this.isTaskInProgress) {
        this.errorMsg = "No task is in progress.";
        return;
      }

      // Saving the task
      this.tasks.unshift({
        id: this.getAnId(),
        name: this.taskName,
        start: this.startTime,
        end: Date.now(),
      });

      // End of task
      this.isTaskInProgress = false;
      this.errorMsg = null;
      this.taskName = "";
    },
    // * ID
    getAnId() {
      this.taskId++;
      return this.taskId;
    },
  },
}).mount("#app");
