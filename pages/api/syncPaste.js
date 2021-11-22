const Pusher = require("pusher");


let sendCopyMessage = async (body) => {
    let message = JSON.parse(body).message;

    Pusher.logToConsole = true;

    const pusher = new Pusher({
        appId: "1301521",
        key: "dff952f2acad25a5a7d5",
        secret: "bc1553ebc68f7483f8e0",
        cluster: "ap3",
        useTLS: true
    });
    
    pusher.trigger("my-channel", "my-event", {
        message: message
    });

    return message;
}

export default async function handler(req, res) {
    try {
      const result = await sendCopyMessage(req.body)
      res.status(200).json({ result })
    } catch (err) {
      res.status(500).json({ error: 'failed to push data' })
    }
}