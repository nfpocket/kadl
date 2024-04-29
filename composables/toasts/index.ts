export const useToasts = () => {
  const toast = useToast();

  const success = (message: string) => {
    toast.add({
      title: "Success",
      description: message,
      color: "green",
      icon: "i-tabler-check",
    });
  };

  const error = (message: string) => {
    toast.add({
      title: "Error",
      description: message,
      color: "red",
      icon: "i-tabler-alert-triangle",
    });
  };

  const info = (message: string) => {
    toast.add({
      title: "Info",
      description: message,
      color: "blue",
      icon: "i-tabler-info-circle",
    });
  };

  const warn = (message: string) => {
    toast.add({
      title: "Warning",
      description: message,
      color: "yellow",
      icon: "i-tabler-alert-circle",
    });
  };

  return {
    success,
    error,
    info,
    warn,
  };
};
