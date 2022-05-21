Vue.directive("pan", {
  bind: function (el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el);
      mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      mc.on("pan", binding.value);
    }
  } });


Vue.directive("tap", {
  bind: function (el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el);
      mc.on("tap", binding.value);
    }
  } });


const app = new Vue({
  el: "#app",
  data: {
    animals: [
    "cat",
    "dog",
    "panda",
    "lion",
    "frog",
    "bear",
    "mouse",
    "tiger",
    "monkey"],

    emojis: ["🐱", "🐶", "🐼", "🦁", "🐸", "🐻", "🐹", "🐯", "🐵"],
    colors: [
    "#F7CC45",
    "#AC6909",
    "#272625",
    "#FFAD01",
    "#81DC58",
    "#C68E71",
    "#F2B2BD",
    "#FFCB00",
    "#BE9763"],

    currentOffset: 0,
    selected: "cat" },

  computed: {
    overflowRatio() {
      return this.$refs.list.scrollWidth / this.$refs.list.offsetWidth;
    },
    itemWidth() {
      return this.$refs.list.scrollWidth / this.animals.length;
    },
    selectedContent() {
      if (this.selected) {
        return this.emojis[this.animals.indexOf(this.selected)];
      }
      return "";
    },
    count() {
      return this.animals.length;
    } },

  watch: {
    selected(newValue) {
      TweenMax.fromTo(
      this.$refs.emoji,
      0.6,
      { scale: 0 },
      { scale: 1, ease: Elastic.easeOut.config(1, 0.8) });

    } },

  methods: {
    onPan(e) {
      const dragOffset = 100 / this.itemWidth * e.deltaX / this.count * this.overflowRatio;

      const transform = this.currentOffset + dragOffset;

      this.$refs.list.style.setProperty("--x", transform);

      if (e.isFinal) {
        this.currentOffset = transform;
        const maxScroll = 100 - this.overflowRatio * 100;
        let finalOffset = this.currentOffset;

        // scrolled to last item
        if (this.currentOffset <= maxScroll) {
          finalOffset = maxScroll;
        } else if (this.currentOffset >= 0) {
          // scroll to first item
          finalOffset = 0;
        } else {
          // animate to next item according to pan direction
          const index = this.currentOffset / this.overflowRatio / 100 * this.count;
          const nextIndex = e.deltaX <= 0 ? Math.floor(index) : Math.ceil(index);
          finalOffset = 100 * this.overflowRatio / this.count * nextIndex;
        }

        // bounce back animation
        TweenMax.fromTo(
        this.$refs.list,
        0.4,
        { '--x': this.currentOffset },
        {
          '--x': finalOffset,
          ease: Elastic.easeOut.config(1, 0.8),
          onComplete: () => {
            this.currentOffset = finalOffset;
          } });


      }
    },
    onTap(e, value) {
      if (value) {
        TweenMax.to(e.target, 0.12, { scale: 1.1, yoyo: true, repeat: 1, ease: Sine.easeOut });
        this.selected = value;
      }
    } } });