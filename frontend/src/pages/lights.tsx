export function HomeAssistantControls() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Home Assistant Lights</h2>
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-xl bg-yellow-400 text-black">💡 On</button>
        <button className="px-4 py-2 rounded-xl bg-gray-500 text-white">💡 Off</button>
      </div>
    </div>
  );
}