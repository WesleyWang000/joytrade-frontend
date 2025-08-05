import { useEffect, useState } from "react";
import { api } from "../api/realApi";

function ChatPage({
  currentUser,
  productId,
  receiver,
  onBack,
  onSelectProduct,
}) {
  const [conversations, setConversations] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(productId || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentReceiver, setCurrentReceiver] = useState(receiver || null);
  const [currentProductInfo, setCurrentProductInfo] = useState(null);

  // 获取当前用户的聊天列表
  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      try {
        const list = await api.getChatList();
        setConversations(list);

        if (productId && receiver) {
          const exists = list.some(
            (c) =>
              c.productId === productId && c.otherUser === receiver.username
          );
          if (!exists) {
            const productDetail = await api.getProductById(productId);
            setConversations([
              {
                productId,
                productName: productDetail.name,
                otherUser: receiver.username,
                productImage: productDetail.image,
                productPrice: productDetail.price,
              },
              ...list,
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };

    fetchConversations();
  }, [currentUser, productId, receiver]);

  // 获取聊天记录
  useEffect(() => {
    if (!selectedProductId) return;

    const loadMessages = async () => {
      try {
        const msgs = await api.getMessages(selectedProductId);
        setMessages(msgs);

        const convo = conversations.find(
          (c) => c.productId === selectedProductId
        );
        if (convo) {
          setCurrentReceiver({ username: convo.otherUser });
          setCurrentProductInfo({
            name: convo.productName,
            image: convo.productImage,
            price: convo.productPrice,
          });
        } else {
          const product = await api.getProductById(selectedProductId);
          setCurrentProductInfo({
            name: product.name,
            image: product.image,
            price: product.price,
          });
        }
      } catch (err) {
        console.error("Failed to load chat records.", err);
      }
    };

    loadMessages();
  }, [selectedProductId, conversations]);

  const handleSelectConversation = (productId, otherUser) => {
    setSelectedProductId(productId);
    setCurrentReceiver({ username: otherUser });
  };

  const handleSend = async () => {
    if (!text.trim() || !currentReceiver || !selectedProductId) return;

    try {
      await api.sendMessage({
        productId: selectedProductId,
        receiver: currentReceiver.username,
        message: text.trim(),
      });
      setText("");
      const updated = await api.getMessages(selectedProductId);
      setMessages(updated);
    } catch (err) {
      alert("Fail to send: " + err.message);
    }
  };

  return (
    <div className="flex h-[80vh]">
      {/* 左侧对话框列表 */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Conversations</h2>
        {conversations.length === 0 && (
          <p className="text-sm text-gray-500">No conversations yet.</p>
        )}
        {conversations.map((c) => (
          <div
            key={`${c.productId}-${c.otherUser}`}
            className={`p-2 rounded cursor-pointer ${
              selectedProductId === c.productId
                ? "bg-indigo-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleSelectConversation(c.productId, c.otherUser)}
          >
            <div className="font-semibold">{c.productName}</div>
            <div className="text-sm text-gray-500">Seller: {c.otherUser}</div>
          </div>
        ))}
      </div>

      {/* 右侧聊天窗口 */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedProductId ? (
          <>
            {/* 聊天顶部商品信息条 */}
            {currentProductInfo && (
              <div
                className="flex items-center gap-4 border-b pb-2 mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => onSelectProduct(selectedProductId)}
              >
                {currentProductInfo.image?.startsWith("data:image") ||
                currentProductInfo.image?.startsWith("http") ? (
                  <img
                    src={currentProductInfo.image}
                    alt="Product"
                    className="w-14 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-300 flex items-center justify-center rounded text-xl">
                    🛍️
                  </div>
                )}
                <div>
                  <div className="text-lg font-semibold">
                    {currentProductInfo.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    ￡{currentProductInfo.price}
                  </div>
                </div>
              </div>
            )}

            {/* 聊天内容 */}
            <div className="flex-1 overflow-y-auto mb-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${
                    msg.sender === currentUser.username
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-3 py-1 rounded-xl ${
                      msg.sender === currentUser.username
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleString()} · {msg.sender}
                  </div>
                </div>
              ))}
            </div>

            {/* 输入框 */}
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-10 text-center">
            ← Select a conversation
          </p>
        )}

        <button className="mt-4 text-blue-600 hover:underline" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
