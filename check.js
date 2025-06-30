const testHosts = [
  'sharp-dynadesk-dt200-iot.local',
  'sharp-dynadesk-dt200-iot-2.local',
  'sharp-dynadesk-dt200-iot-3.local'
];

async function tryFetchPing(host) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);

    const res = await fetch(`http://${host}:3000/ping`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeout);
    if (res.ok) {
      const text = await res.text();
      return { host, text };
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function redirectToAvailableHost() {
  for (const host of testHosts) {
    const result = await tryFetchPing(host);
    if (result) {
      document.getElementById("host").textContent = `接続先: ${result.host}`;
      document.getElementById("pong").textContent = result.text;

      setTimeout(() => {
        window.location.href = `http://${result.host}:3000`;
      }, 2000);
      return;
    }
  }

  document.getElementById("host").textContent = "接続可能な端末が見つかりませんでした";
}

redirectToAvailableHost();