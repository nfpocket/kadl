export default defineAppConfig({
  ui: {
    primary: "cornflower-blue",
    gray: "neutral",
    input: {
      variant: {
        seamless:
          "ml-[-0.875rem] w-[calc(100%+0.875rem)] outline outline-1 outline-transparent hover:outline-gray-400/50 focus:outline-primary bg-transparent focus:ring-0 focus:shadow-none focus:outline-offset-0",
      },
      size: {
        "3xl": "text-3xl px-4 py-3",
      },
    },
    textarea: {
      variant: {
        seamless:
          "ml-[-0.875rem] w-[calc(100%+0.875rem)] outline outline-1 outline-transparent hover:outline-gray-400/50 focus:outline-primary bg-transparent focus:ring-0 focus:shadow-none focus:outline-offset-0",
      },
      padding: {
        sm: "px-3.5 py-2.5",
      },
    },
  },
});
