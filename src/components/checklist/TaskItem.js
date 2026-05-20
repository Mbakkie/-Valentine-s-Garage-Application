
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { formatDate } from '../../utils/formatters';

/**
 * @param {object}   task         - Task document from Firestore
 * @param {Function} onToggle     - Called when checkbox pressed
 * @param {Function} onSaveNote   - Called with (taskDocId, noteText)
 * @param {boolean}  canEdit      - Whether the current user can interact
 */
const TaskItem = ({ task, onToggle, onSaveNote, canEdit = true }) => {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState(task.note || '');
  const [saving, setSaving] = useState(false);

  const handleSaveNote = async () => {
    setSaving(true);
    await onSaveNote(task.id, noteText);
    setSaving(false);
    setExpanded(false);
  };

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      {/* Main row */}
      <View style={styles.row}>
        {/* Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxDone]}
          onPress={() => canEdit && onToggle(task)}
          disabled={!canEdit}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={14} color={COLORS.black} />
          )}
        </TouchableOpacity>

        {/* Task info */}
        <View style={styles.info}>
          <View style={styles.titleRow}>
            {task.critical && !task.completed && (
              <View style={styles.criticalBadge}>
                <Text style={styles.criticalText}>!</Text>
              </View>
            )}
            <Text
              style={[
                styles.taskText,
                task.completed && styles.completedText,
              ]}
              numberOfLines={2}
            >
              {task.task}
            </Text>
          </View>

          {task.completed && (
            <Text style={styles.completedBy}>
              ✓ {task.completedByName} · {formatDate(task.completedAt)}
            </Text>
          )}

          {task.note ? (
            <Text style={styles.notePreview} numberOfLines={1}>
              📝 {task.note}
            </Text>
          ) : null}
        </View>

        {/* Note toggle */}
        <TouchableOpacity
          style={styles.noteBtn}
          onPress={() => setExpanded(!expanded)}
        >
          <Ionicons
            name={expanded ? 'chevron-up' : 'create-outline'}
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Expanded note editor */}
      {expanded && (
        <View style={styles.noteEditor}>
          <TextInput
            style={styles.noteInput}
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Add a note about this task…"
            placeholderTextColor={COLORS.textDisabled}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSaveNote}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Saving…' : 'Save Note'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  completedContainer: {
    borderColor: COLORS.success + '44',
    backgroundColor: COLORS.success + '0A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  criticalBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    marginTop: 2,
  },
  criticalText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
  },
  taskText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  completedText: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  completedBy: {
    color: COLORS.success,
    fontSize: 11,
    marginTop: 4,
  },
  notePreview: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  noteEditor: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  noteInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    padding: 10,
    fontSize: 13,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  saveBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: {
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default TaskItem;