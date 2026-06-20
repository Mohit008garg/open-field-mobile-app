import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  Card,
  Logo,
  PrimaryButton,
  SectionHeader,
  SegmentedTabs,
} from '@mohit008garg/open-field-common-components';
import {
  addComment,
  createPost,
  getComments,
  getFeed,
  getHomeStats,
  toggleLike,
  type FeedTab,
  type HomeStats,
  type Post,
  type PostComment,
} from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { colors, fontSize, radius, spacing } from '@/theme';

const HERO_DISMISSED_KEY = 'home:heroDismissed';

type IoniconName = keyof typeof Ionicons.glyphMap;

const QUICK = [
  { icon: 'person-add' as IoniconName, label: 'Find Players', tint: '#DCFCE7', color: '#16A34A' },
  { icon: 'school' as IoniconName, label: 'Find Coaches', tint: '#DBEAFE', color: '#2563EB' },
  { icon: 'business' as IoniconName, label: 'Academies', tint: '#F3E8FF', color: '#9333EA' },
  { icon: 'trophy' as IoniconName, label: 'Tournaments', tint: '#FFEDD5', color: '#EA580C' },
];

const FEED_TABS = ['For You', 'Following', 'Communities', 'Events'] as const;
const TAB_KEY: Record<string, FeedTab> = {
  'For You': 'for_you',
  Following: 'following',
  Communities: 'communities',
  Events: 'events',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Yesterday' : `${d}d`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();
  const displayName = profile?.fullName ?? user?.name ?? user?.email ?? 'OpenField';

  const [stats, setStats] = useState<HomeStats | null>(null);
  const [tab, setTab] = useState<string>('For You');
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [commentsFor, setCommentsFor] = useState<Post | null>(null);
  const [heroHidden, setHeroHidden] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(HERO_DISMISSED_KEY)
      .then((v) => setHeroHidden(v === '1'))
      .catch(() => setHeroHidden(false));
  }, []);

  const dismissHero = () => {
    setHeroHidden(true);
    AsyncStorage.setItem(HERO_DISMISSED_KEY, '1').catch(() => undefined);
  };

  const loadStats = useCallback(() => {
    getHomeStats().then(setStats).catch(() => undefined);
  }, []);

  const loadFeed = useCallback((t: string) => {
    setFeedLoading(true);
    getFeed(TAB_KEY[t])
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setFeedLoading(false));
  }, []);

  useEffect(() => loadStats(), [loadStats]);
  useEffect(() => loadFeed(tab), [tab, loadFeed]);

  const submitPost = async () => {
    const content = draft.trim();
    if (!content || posting) return;
    setPosting(true);
    try {
      await createPost(content);
      setDraft('');
      if (tab !== 'For You') setTab('For You');
      else loadFeed('For You');
      loadStats();
    } catch {
      // ignore — surfaced by an empty draft staying put
    } finally {
      setPosting(false);
    }
  };

  const onLike = async (post: Post) => {
    // optimistic
    setPosts((ps) =>
      ps.map((p) =>
        p.id === post.id
          ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) }
          : p,
      ),
    );
    try {
      await toggleLike(post.id);
    } catch {
      loadFeed(tab); // revert by reloading
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.push('/menu')} hitSlop={8}>
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Logo size={26} />
        <View style={styles.topRight}>
          <Pressable onPress={() => router.push('/messages')} hitSlop={8}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.text} />
          </Pressable>
          <View>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.bellDot} />
          </View>
          <Avatar name={displayName} size={32} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players, coaches, events..."
            placeholderTextColor={colors.textFaint}
          />
        </View>

        {!heroHidden && (
          <ImageBackground
            source={{ uri: 'https://picsum.photos/seed/openfield-hero/700/400' }}
            style={styles.hero}
            imageStyle={styles.heroImg}
          >
            <View style={styles.heroOverlay}>
              <Pressable style={styles.heroClose} onPress={dismissHero} hitSlop={8}>
                <Ionicons name="close" size={18} color={colors.textInverse} />
              </Pressable>
              <Text style={styles.heroTitle}>
                Connect. Discover.{'\n'}
                <Text style={{ color: colors.primaryTint }}>Grow in Sports.</Text>
              </Text>
              <Text style={styles.heroSub}>OpenField is your platform to build your identity.</Text>
              <View style={styles.heroBtns}>
                <PrimaryButton label="My Profile" size="sm" onPress={() => router.push('/profile')} />
                <PrimaryButton label="Explore" size="sm" variant="outline" onPress={() => router.push('/discover')} />
              </View>
            </View>
          </ImageBackground>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="eye-outline" label="Profile Views" value={stats ? String(stats.profileViews) : '—'} />
          <StatCard icon="people-outline" label="Connections" value={stats ? String(stats.connections) : '—'} />
          <StatCard icon="briefcase-outline" label="Opportunities" value={stats ? String(stats.opportunities) : '—'} />
        </View>

        {/* Quick access */}
        <SectionHeader title="Quick Access" actionLabel="View All" />
        <View style={styles.quickRow}>
          {QUICK.map((q) => (
            <Pressable
              key={q.label}
              style={styles.quick}
              onPress={() => router.push(q.label === 'Tournaments' ? '/events' : '/discover')}
            >
              <View style={[styles.quickIcon, { backgroundColor: q.tint }]}>
                <Ionicons name={q.icon} size={22} color={q.color} />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Composer */}
        <Card style={styles.composer}>
          <View style={styles.composerTop}>
            <Avatar name={displayName} size={36} />
            <TextInput
              style={styles.composerInput}
              placeholder="What's happening in your sporting world?"
              placeholderTextColor={colors.textMuted}
              value={draft}
              onChangeText={setDraft}
              multiline
            />
          </View>
          <View style={styles.composerActions}>
            <ComposerAction icon="image-outline" label="Photo" />
            <ComposerAction icon="trophy-outline" label="Achievement" />
            <PrimaryButton
              label={posting ? 'Posting…' : 'Post'}
              size="sm"
              style={styles.postBtn}
              disabled={posting || !draft.trim()}
              onPress={submitPost}
            />
          </View>
        </Card>

        {/* Feed tabs */}
        <SegmentedTabs tabs={FEED_TABS} value={tab} onChange={setTab} bordered />

        {/* Timeline */}
        {feedLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
        ) : posts.length ? (
          <View style={{ gap: spacing.md }}>
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onLike={() => onLike(p)}
                onComment={() => setCommentsFor(p)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.feedEmpty}>
            <Ionicons
              name={tab === 'Communities' ? 'people-circle-outline' : tab === 'Events' ? 'calendar-outline' : 'newspaper-outline'}
              size={36}
              color={colors.textFaint}
            />
            <Text style={styles.feedEmptyText}>
              {tab === 'Communities'
                ? 'Join communities to see their posts here.'
                : tab === 'Events'
                  ? 'Event updates will appear here.'
                  : 'No posts yet. Be the first to share!'}
            </Text>
          </View>
        )}
      </ScrollView>

      <CommentsModal
        post={commentsFor}
        onClose={() => setCommentsFor(null)}
        onAdded={(postId) =>
          setPosts((ps) =>
            ps.map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p)),
          )
        }
      />
    </SafeAreaView>
  );
}

function CommentsModal({
  post,
  onClose,
  onAdded,
}: {
  post: Post | null;
  onClose: () => void;
  onAdded: (postId: string) => void;
}) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!post) return;
    setComments([]);
    setLoading(true);
    getComments(post.id)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [post]);

  const send = async () => {
    const content = draft.trim();
    if (!content || !post || sending) return;
    setSending(true);
    try {
      const created = await addComment(post.id, content);
      setComments((c) => [...c, created]);
      setDraft('');
      onAdded(post.id);
    } catch {
      // keep draft on failure
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal visible={!!post} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.modalDismiss} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Comments</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.commentList} contentContainerStyle={{ paddingBottom: spacing.md }}>
            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
            ) : comments.length ? (
              comments.map((c) => (
                <View key={c.id} style={styles.commentRow}>
                  <Avatar name={c.author.name} size={34} />
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentName}>{c.author.name}</Text>
                    <Text style={styles.commentText}>{c.content}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.commentEmpty}>No comments yet. Start the conversation!</Text>
            )}
          </ScrollView>

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment…"
              placeholderTextColor={colors.textFaint}
              value={draft}
              onChangeText={setDraft}
              multiline
            />
            <Pressable
              onPress={send}
              disabled={sending || !draft.trim()}
              style={[styles.sendBtn, (sending || !draft.trim()) && styles.sendBtnOff]}
            >
              <Ionicons name="send" size={18} color={colors.textInverse} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function StatCard({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
  return (
    <Card style={styles.stat}>
      <View style={styles.statHead}>
        <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
        <Ionicons name={icon} size={15} color={colors.textFaint} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );
}

function PostCard({ post, onLike, onComment }: { post: Post; onLike: () => void; onComment: () => void }) {
  return (
    <Card style={styles.post}>
      <View style={styles.postHead}>
        <Avatar name={post.author.name} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={styles.postName}>{post.author.name}</Text>
          <Text style={styles.postMeta}>
            {post.author.role} · {timeAgo(post.createdAt)}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.textFaint} />
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postActions}>
        <Pressable style={styles.postAction} onPress={onLike} hitSlop={6}>
          <Ionicons
            name={post.liked ? 'heart' : 'heart-outline'}
            size={18}
            color={post.liked ? colors.danger : colors.textMuted}
          />
          <Text style={styles.postActionText}>{post.likeCount}</Text>
        </Pressable>
        <Pressable style={styles.postAction} onPress={onComment} hitSlop={6}>
          <Ionicons name="chatbubble-outline" size={17} color={colors.textMuted} />
          <Text style={styles.postActionText}>{post.commentCount}</Text>
        </Pressable>
        <View style={styles.postAction}>
          <Ionicons name="share-social-outline" size={17} color={colors.textMuted} />
        </View>
      </View>
    </Card>
  );
}

function ComposerAction({ icon, label }: { icon: IoniconName; label: string }) {
  return (
    <View style={styles.composerAction}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.composerActionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 52,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bellDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  searchInput: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  hero: { height: 180, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.text },
  heroImg: { borderRadius: radius.lg },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  heroClose: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textInverse, lineHeight: 30 },
  heroSub: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.85)' },
  heroBtns: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, gap: 4, paddingHorizontal: spacing.sm },
  statHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  statLabel: { flex: 1, fontSize: 11, color: colors.textMuted },
  statValue: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quick: { alignItems: 'center', gap: spacing.xs, width: '23%' },
  quickIcon: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textAlign: 'center' },
  composer: { gap: spacing.md },
  composerTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  composerInput: { flex: 1, color: colors.text, fontSize: fontSize.sm, minHeight: 36, paddingTop: 8 },
  composerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  composerAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  composerActionLabel: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600' },
  postBtn: { marginLeft: 'auto', paddingHorizontal: spacing.lg },
  post: { gap: spacing.sm },
  postHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  postName: { fontSize: fontSize.sm, fontWeight: '800', color: colors.text },
  postMeta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 1 },
  postContent: { fontSize: fontSize.sm, color: colors.text, lineHeight: 21 },
  postActions: {
    flexDirection: 'row',
    gap: spacing.xl,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postActionText: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600' },
  feedEmpty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  feedEmptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalDismiss: { flex: 1 },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    maxHeight: '80%',
    minHeight: '50%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  commentList: { flex: 1, marginTop: spacing.sm },
  commentRow: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  commentName: { fontSize: fontSize.xs, fontWeight: '800', color: colors.text },
  commentText: { fontSize: fontSize.sm, color: colors.text },
  commentEmpty: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commentInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: { opacity: 0.5 },
});
