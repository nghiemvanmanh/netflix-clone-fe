import { Button } from "antd";
import { User } from "lucide-react";

interface CommentProps {
  comments: any[];
  user: any;
  handleAddComment: (comment: any) => void;
  handleDeleteComment: (commentId: string) => void;
}
import { DeleteOutlined } from "@ant-design/icons";
import { formatTime } from "@/constants/date";
import { useRef } from "react";
export function Comment({
  comments,
  user,
  handleAddComment,
  handleDeleteComment,
}: CommentProps) {
  const commentRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="bg-gradient-to-br from-gray-800 to-black rounded-lg p-8 mb-8 border border-gray-700 shadow-xl shadow-black/30">
      <h2 className="text-2xl font-bold mb-6">Bình luận</h2>

      {/* Comments List */}
      <div className="space-y-6 mb-8">
        {/* TODO: Replace with real API call */}
        {/*  */}
        {comments?.map((comment: any) => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {comment.profile.avatarUrl ? (
                  <img
                    src={comment.profile.avatarUrl}
                    alt={comment.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <User className="w-10 h-10 text-white " />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{comment.name}</p>
                  <span className="text-xs text-gray-400">
                    {formatTime(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="text-gray-300 mt-1">{comment.content}</p>
              </div>
              {user?.isAdmin && (
                <Button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this comment?")
                    ) {
                      handleDeleteComment(comment.id);
                    }
                  }}
                >
                  <DeleteOutlined />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Thêm bình luận</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const commentInput = form.elements.namedItem(
              "comment"
            ) as HTMLTextAreaElement;
            const comment = commentInput.value.trim();

            if (comment) {
              handleAddComment(comment);
              if (commentRef?.current) commentRef.current.value = "";
            }
          }}
        >
          <textarea
            ref={commentRef}
            name="comment"
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            rows={3}
            placeholder="Chia sẻ suy nghĩ của bạn về bộ phim này..."
            required
          ></textarea>
          <p className="text-gray-400 text-xs mt-1">
            Bạn có thể bình luận về nội dung, diễn xuất, đạo diễn...
          </p>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Đăng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
