import mitt from "mitt";

export type ApplicationEvents = {
  triggerFocusSubnoteById: number;
};

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>();

  return {
    provide: {
      bus: {
        $emit: emitter.emit,
        $on: emitter.on,
        $off: emitter.off,
      },
    },
  };
});
