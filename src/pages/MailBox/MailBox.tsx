import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Archive, ArrowLeft, CheckCheck, Inbox, MailOpen, Search, Star, StarOff } from 'lucide-react';
import { useSeo } from '../../shared/utils/useSeo';
import './MailBox.scss';

type MailType = 'adoption' | 'donation' | 'system' | 'message';
type MailFolder = 'inbox' | 'unread' | 'starred' | 'archived';

interface MailMessage {
  id: string;
  type: MailType;
  sender: string;
  subject: string;
  preview: string;
  body: string[];
  time: string;
  date: string;
  unread: boolean;
  archived: boolean;
  starred: boolean;
}

const demoMessages: MailMessage[] = [
  {
    id: 'adoption-demo-1',
    type: 'adoption',
    sender: 'Adoption Desk',
    subject: 'New adoption request',
    preview: 'Luna has received a new adoption request.',
    body: [
      'A new adoption request has been submitted for Luna.',
      'Applicant: Kateryna Bondar.',
      'Please review the profile and contact details in the admin panel to continue the screening process.',
    ],
    time: '5 min ago',
    date: 'Today, 10:25',
    unread: true,
    archived: false,
    starred: false,
  },
  {
    id: 'donation-demo-1',
    type: 'donation',
    sender: 'Donations',
    subject: 'Donation received: $50',
    preview: 'A new donation has been processed successfully.',
    body: [
      'A donation of $50 has been received from an anonymous supporter.',
      'Please make sure the donor receives a thank-you follow up if contact details were provided.',
    ],
    time: '1 h ago',
    date: 'Today, 09:11',
    unread: true,
    archived: false,
    starred: true,
  },
  {
    id: 'system-demo-1',
    type: 'system',
    sender: 'System',
    subject: 'Catalog sync completed',
    preview: 'Animal catalog and request statuses are up to date.',
    body: [
      'Nightly synchronization has been completed.',
      'No conflicts were detected between profile data and adoption statuses.',
    ],
    time: '3 h ago',
    date: 'Today, 07:00',
    unread: false,
    archived: false,
    starred: false,
  },
  {
    id: 'message-demo-1',
    type: 'message',
    sender: 'Contact form',
    subject: 'New volunteer message',
    preview: 'A volunteer candidate sent a message via contact form.',
    body: [
      'You have received a new message from the contact form.',
      'Topic: Volunteering on weekends.',
      'Open admin mailbox to assign a response owner.',
    ],
    time: 'Yesterday',
    date: 'Apr 2, 16:48',
    unread: false,
    archived: true,
    starred: false,
  },
];

export default function MailBox() {
  useSeo({
    title: 'Notifications Mailbox | Dnipro Animals',
    description: 'Review admin notifications and messages in full-screen mailbox view.',
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [folder, setFolder] = useState<MailFolder>('inbox');
  const [messages, setMessages] = useState<MailMessage[]>(demoMessages);
  const [selectedId, setSelectedId] = useState<string>(demoMessages[0].id);

  const focusMessageId = (location.state as { focusMessageId?: string } | null)?.focusMessageId;

  useEffect(() => {
    if (!focusMessageId) {
      return;
    }

    setFolder('inbox');
    setSelectedId(focusMessageId);
    setMessages((prev) =>
      prev.map((message) => (message.id === focusMessageId ? { ...message, unread: false } : message)),
    );
    navigate('/mailbox', { replace: true, state: null });
  }, [focusMessageId, navigate]);

  const folderCounts = useMemo(() => {
    const inbox = messages.filter((message) => !message.archived).length;
    const unread = messages.filter((message) => !message.archived && message.unread).length;
    const starred = messages.filter((message) => !message.archived && message.starred).length;
    const archived = messages.filter((message) => message.archived).length;

    return { inbox, unread, starred, archived };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return messages
      .filter((message) => {
        const inFolder =
          folder === 'inbox'
            ? !message.archived
            : folder === 'unread'
              ? !message.archived && message.unread
              : folder === 'starred'
                ? !message.archived && message.starred
                : message.archived;

        if (!inFolder) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return (
          message.subject.toLowerCase().includes(normalizedQuery) ||
          message.sender.toLowerCase().includes(normalizedQuery) ||
          message.preview.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => Number(b.unread) - Number(a.unread));
  }, [messages, folder, searchQuery]);

  useEffect(() => {
    if (!filteredMessages.length) {
      return;
    }

    if (!filteredMessages.some((message) => message.id === selectedId)) {
      setSelectedId(filteredMessages[0].id);
    }
  }, [filteredMessages, selectedId]);

  const selectedMessage = filteredMessages.find((message) => message.id === selectedId) ?? filteredMessages[0] ?? null;

  const openMessage = (id: string) => {
    setSelectedId(id);
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, unread: false } : message)));
  };

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((message) => ({ ...message, unread: false })));
  };

  const toggleReadForSelected = () => {
    if (!selectedMessage) {
      return;
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.id === selectedMessage.id ? { ...message, unread: !selectedMessage.unread } : message,
      ),
    );
  };

  const toggleStarForSelected = () => {
    if (!selectedMessage) {
      return;
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.id === selectedMessage.id ? { ...message, starred: !selectedMessage.starred } : message,
      ),
    );
  };

  const toggleArchiveForSelected = () => {
    if (!selectedMessage) {
      return;
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.id === selectedMessage.id
          ? {
              ...message,
              archived: !selectedMessage.archived,
              unread: false,
            }
          : message,
      ),
    );
  };

  return (
    <main className="page mailbox-page">
      <div className="app-container mailbox-page__wrap" data-header-anchor>
        <header className="mailbox-page__head">
          <Link to="/admin" className="mailbox-page__back">
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>
          <div className="mailbox-page__summary">
            <p>Mailbox</p>
            <strong>{folderCounts.unread} unread</strong>
          </div>
        </header>

        <section className="mailbox-shell">
          <aside className="mailbox-sidebar" aria-label="Mailbox folders">
            <h1>Notifications inbox</h1>
            <p>Read incoming updates, requests, and system messages.</p>

            <nav className="mailbox-folders">
              <button
                type="button"
                className={folder === 'inbox' ? 'mailbox-folder is-active' : 'mailbox-folder'}
                onClick={() => setFolder('inbox')}
              >
                <span>
                  <Inbox size={16} />
                  Inbox
                </span>
                <strong>{folderCounts.inbox}</strong>
              </button>
              <button
                type="button"
                className={folder === 'unread' ? 'mailbox-folder is-active' : 'mailbox-folder'}
                onClick={() => setFolder('unread')}
              >
                <span>
                  <MailOpen size={16} />
                  Unread
                </span>
                <strong>{folderCounts.unread}</strong>
              </button>
              <button
                type="button"
                className={folder === 'starred' ? 'mailbox-folder is-active' : 'mailbox-folder'}
                onClick={() => setFolder('starred')}
              >
                <span>
                  <Star size={16} />
                  Starred
                </span>
                <strong>{folderCounts.starred}</strong>
              </button>
              <button
                type="button"
                className={folder === 'archived' ? 'mailbox-folder is-active' : 'mailbox-folder'}
                onClick={() => setFolder('archived')}
              >
                <span>
                  <Archive size={16} />
                  Archived
                </span>
                <strong>{folderCounts.archived}</strong>
              </button>
            </nav>

            <button type="button" className="mailbox-sidebar__mark-all" onClick={markAllAsRead}>
              <CheckCheck size={16} />
              Mark all as read
            </button>
          </aside>

          <section className="mailbox-workspace" aria-label="Messages">
            <header className="mailbox-toolbar">
              <div className="mailbox-search">
                <Search size={16} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by subject, sender, or text"
                  aria-label="Search messages"
                />
              </div>
            </header>

            <div className="mailbox-content">
              <section className="mailbox-list" aria-label="Messages list">
                {filteredMessages.length === 0 ? (
                  <p className="mailbox-list__empty">No notifications yet</p>
                ) : (
                  <ul>
                    {filteredMessages.map((message) => (
                      <li key={message.id}>
                        <button
                          type="button"
                          className={`mailbox-list-item mailbox-list-item--${message.type}${selectedId === message.id ? ' is-active' : ''}${message.unread ? ' is-unread' : ''}`}
                          onClick={() => openMessage(message.id)}
                        >
                          <div className="mailbox-list-item__head">
                            <strong>{message.subject}</strong>
                            <span>{message.time}</span>
                          </div>
                          <p className="mailbox-list-item__sender">{message.sender}</p>
                          <p>{message.preview}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <article className="mailbox-reader" aria-label="Message content">
                {selectedMessage ? (
                  <>
                    <header className="mailbox-reader__head">
                      <div className={`mailbox-reader__type mailbox-reader__type--${selectedMessage.type}`}>
                        {selectedMessage.type}
                      </div>
                      <h2>{selectedMessage.subject}</h2>
                      <p>
                        From <strong>{selectedMessage.sender}</strong> • {selectedMessage.date}
                      </p>
                    </header>

                    <div className="mailbox-reader__actions">
                      <button type="button" onClick={toggleReadForSelected}>
                        {selectedMessage.unread ? <MailOpen size={15} /> : <Inbox size={15} />}
                        {selectedMessage.unread ? 'Mark as read' : 'Mark as unread'}
                      </button>
                      <button type="button" onClick={toggleStarForSelected}>
                        {selectedMessage.starred ? <StarOff size={15} /> : <Star size={15} />}
                        {selectedMessage.starred ? 'Remove star' : 'Add star'}
                      </button>
                      <button type="button" onClick={toggleArchiveForSelected}>
                        <Archive size={15} />
                        {selectedMessage.archived ? 'Restore to inbox' : 'Archive'}
                      </button>
                    </div>

                    <div className="mailbox-reader__body">
                      {selectedMessage.body.map((paragraph, index) => (
                        <p key={`${selectedMessage.id}-paragraph-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mailbox-reader__empty">
                    <h2>Select a message</h2>
                    <p>Choose an item from the left list to read full details.</p>
                  </div>
                )}
              </article>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
