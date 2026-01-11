import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import MessageModal from '../components/MessageModal'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [messageModal, setMessageModal] = useState({ isOpen: false, receiverId: null })
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadConversations()
    loadUnreadCount()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await api.getConversations()
      setConversations(response.conversations || [])
    } catch (err) {
      console.error('Failed to load conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await api.getUnreadCount()
      setUnreadCount(response.unreadCount || 0)
    } catch (err) {
      console.error('Failed to load unread count:', err)
    }
  }

  const loadMessages = async (userId) => {
    try {
      const response = await api.getMessages(userId)
      setMessages(response.messages || [])
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
    loadMessages(conversation.user._id)
  }

  const sendMessage = async (receiverId) => {
    setMessageModal({ isOpen: true, receiverId })
  }

  const handleMessageSent = () => {
    loadConversations()
    if (selectedConversation) {
      loadMessages(selectedConversation.user._id)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      await api.markMessageAsRead(messageId)
      loadMessages(selectedConversation.user._id)
      loadUnreadCount()
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

  const deleteMessage = async (messageId) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await api.deleteMessage(messageId)
        loadMessages(selectedConversation.user._id)
      } catch (err) {
        console.error('Failed to delete message:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">Loading messages...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="divide-y">
                {conversations.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.user._id}
                      onClick={() => selectConversation(conversation)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedConversation?.user._id === conversation.user._id
                          ? 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {conversation.user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium truncate">
                              {conversation.user.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage.subject}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{selectedConversation.user.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => sendMessage(selectedConversation.user._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    New Message
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender._id === selectedConversation.user._id
                          ? 'justify-start'
                          : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender._id === selectedConversation.user._id
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <div className="font-medium text-sm mb-1">
                          {message.subject}
                        </div>
                        <div>{message.content}</div>
                        <div className="text-xs mt-1 opacity-75">
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                        {!message.isRead && message.sender._id !== selectedConversation.user._id && (
                          <button
                            onClick={() => markAsRead(message._id)}
                            className="text-xs underline mt-1"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(message._id)}
                          className="text-xs underline mt-1 ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ isOpen: false, receiverId: null })}
        receiverId={messageModal.receiverId}
        onMessageSent={handleMessageSent}
      />
    </div>
  )
}
