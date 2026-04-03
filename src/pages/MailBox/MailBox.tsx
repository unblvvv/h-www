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
    sender: 'Відділ усиновлень',
    subject: 'Нова заявка на усиновлення',
    preview: 'Луна отримала нову заявку на усиновлення.',
    body: [
      'Подано нову заявку на усиновлення Луни.',
      'Заявник: Катерина Бондар.',
      'Перегляньте профіль і контактні дані в адмін-панелі, щоб продовжити перевірку.',
    ],
    time: '5 хв тому',
    date: 'Сьогодні, 10:25',
    unread: true,
    archived: false,
    starred: false,
  },
  {
    id: 'donation-demo-1',
    type: 'donation',
    sender: 'Донати',
    subject: 'Отримано донат: $50',
    preview: 'Новий донат успішно оброблено.',
    body: [
      'Отримано донат $50 від анонімного благодійника.',
      'Якщо є контактні дані, надішліть подяку.',
    ],
    time: '1 год тому',
    date: 'Сьогодні, 09:11',
    unread: true,
    archived: false,
    starred: true,
  },
  {
    id: 'system-demo-1',
    type: 'system',
    sender: 'Система',
    subject: 'Синхронізацію каталогу завершено',
    preview: 'Каталог тварин і статуси заявок актуальні.',
    body: [
      'Нічну синхронізацію завершено.',
      'Конфліктів між даними профілю та статусами усиновлення не виявлено.',
    ],
    time: '3 год тому',
    date: 'Сьогодні, 07:00',
    unread: false,
    archived: false,
    starred: false,
  },
  {
    id: 'message-demo-1',
    type: 'message',
    sender: 'Форма контакту',
    subject: 'Нове повідомлення від волонтера',
    preview: 'Кандидат у волонтери надіслав повідомлення через форму контакту.',
    body: [
      'Ви отримали нове повідомлення з форми контакту.',
      'Тема: Волонтерство у вихідні.',
      'Відкрийте адмін-скриньку, щоб призначити відповідального за відповідь.',
    ],
    time: 'Вчора',
    date: '2 квітня, 16:48',
    unread: false,
    archived: true,
    starred: false,
  },
];

const mailTypeLabels: Record<MailType, string> = {
  adoption: 'Усиновлення',
  donation: 'Донати',
  system: 'Система',
  message: 'Повідомлення',
};

export default function MailBox() {
  useSeo({
    title: 'Поштова скринька сповіщень | Dnipro Animals',
    description: 'Переглядайте адмін-сповіщення та повідомлення у повноекранному режимі.',
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
            Назад до панелі
          </Link>
          <div className="mailbox-page__summary">
            <p>Пошта</p>
            <strong>{folderCounts.unread} непрочитаних</strong>
          </div>
        </header>

        <section className="mailbox-shell">
          <aside className="mailbox-sidebar" aria-label="Папки пошти">
            <h1>Скринька сповіщень</h1>
            <p>Читайте вхідні оновлення, заявки та системні повідомлення.</p>

            <nav className="mailbox-folders">
              <button
                type="button"
                className={folder === 'inbox' ? 'mailbox-folder is-active' : 'mailbox-folder'}
                onClick={() => setFolder('inbox')}
              >
                <span>
                  <Inbox size={16} />
                  Вхідні
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
                  Непрочитані
                </span>
                <strong>{folderCounts.unread}</strong>
              </button>
            </nav>

            <button type="button" className="mailbox-sidebar__mark-all" onClick={markAllAsRead}>
              <CheckCheck size={16} />
              Позначити всі як прочитані
            </button>
          </aside>

          <section className="mailbox-workspace" aria-label="Повідомлення">
            <header className="mailbox-toolbar">
              <div className="mailbox-search">
                <Search size={16} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Пошук за темою, відправником або текстом"
                  aria-label="Пошук повідомлень"
                />
              </div>
            </header>

            <div className="mailbox-content">
              <section className="mailbox-list" aria-label="Список повідомлень">
                {filteredMessages.length === 0 ? (
                  <p className="mailbox-list__empty">Поки що немає сповіщень</p>
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

              <article className="mailbox-reader" aria-label="Вміст повідомлення">
                {selectedMessage ? (
                  <>
                    <header className="mailbox-reader__head">
                      <div className={`mailbox-reader__type mailbox-reader__type--${selectedMessage.type}`}>
                        {mailTypeLabels[selectedMessage.type]}
                      </div>
                      <h2>{selectedMessage.subject}</h2>
                      <p>
                        Від <strong>{selectedMessage.sender}</strong> • {selectedMessage.date}
                      </p>
                    </header>

                    <div className="mailbox-reader__actions">
                      <button type="button" onClick={toggleReadForSelected}>
                        {selectedMessage.unread ? <MailOpen size={15} /> : <Inbox size={15} />}
                        {selectedMessage.unread ? 'Позначити як прочитане' : 'Позначити як непрочитане'}
                      </button>
                      <button type="button" onClick={toggleStarForSelected}>
                        {selectedMessage.starred ? <StarOff size={15} /> : <Star size={15} />}
                        {selectedMessage.starred ? 'Прибрати з обраного' : 'Додати в обране'}
                      </button>
                      <button type="button" onClick={toggleArchiveForSelected}>
                        <Archive size={15} />
                        {selectedMessage.archived ? 'Повернути у вхідні' : 'Архівувати'}
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
                    <h2>Оберіть повідомлення</h2>
                    <p>Оберіть елемент у списку ліворуч, щоб прочитати деталі.</p>
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
