import { StyleSheet, Text, TextInput, View, Button, Pressable, Alert, FlatList, Switch, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

type Ticket = {
  id: string,
  title: string,
  description: string,
  status: 'Created' | 'Under Assistance' | 'Completed';
  rating: number|null
}

export default function index()  {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TCK-001",
      title: "Unable to login to dashboard",
      description: "User reports that login credentials are rejected despite being correct.",
      status: "Created",
      rating: 2
    },
    {
      id: "TCK-002",
      title: "Payment gateway timeout",
      description: "Transactions fail intermittently with a timeout error on checkout.",
      status: "Under Assistance",
      rating: 3
    },
    {
      id: "TCK-003",
      title: "Broken image on homepage",
      description: "The hero banner image fails to load on Safari and Firefox.",
      status: "Completed",
      rating: 4
    },
    {
      id: "TCK-004",
      title: "App crashes on launch (Android)",
      description: "Several users report that the app crashes immediately after opening.",
      status: "Completed",
      rating: 1
    },
    {
      id: "TCK-005",
      title: "Incorrect invoice total",
      description: "Invoice totals are miscalculated when applying multiple discounts.",
      status: "Under Assistance",
      rating: 5
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Created' | 'Under Assistance' | 'Completed'>('Created');



   const openModal = (ticket?: Ticket) => {
    if (ticket) {
      setEditingTicket(ticket);
      setTitle(ticket.title);
      setDescription(ticket.description);
      setStatus(ticket.status);
    } else {
      setEditingTicket(null);
      setTitle('');
      setDescription('');
      setStatus('Created');
    }
    setModalVisible(true);
  };

  const saveTicket = () => {
    if (editingTicket) {
      setTickets(prev =>
        prev.map(t =>
          t.id === editingTicket.id ? { ...t, title, description, status } : t
        )
      );
    } else {
      const newTicket: Ticket = {
        id: `TCK-${Date.now()}`,
        title,
        description,
        status,
        rating: null,
      };
      setTickets(prev => [...prev, newTicket]);
    }
    setModalVisible(false);
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const setRating = (id: string, rating: number) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, rating } : t))
    );
  };

  const statusColor = {
    Created: '#007bff',
    'Under Assistance': '#ffc107',
    Completed: '#28a745',
  };


  const TicketItem = ({ ticket }: { ticket: Ticket }) => (
    <View style={styles.ticket}>
      <Text style={styles.title}>{ticket.title}</Text>
      <Text style={{color: '#808080ff'}}>{ticket.description}</Text>
      <Text style={[styles.status, { color: statusColor[ticket.status] }]}>
        {ticket.status}
      </Text>

      {ticket.status === 'Completed' && (
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setRating(ticket.id, n)}>
              <Ionicons
                name={n <= (ticket.rating ?? 0) ? 'star' : 'star-outline'}
                size={24}
                color="#f5c518"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Pressable onPress={() => openModal(ticket)}>
          <Ionicons name="create-outline" size={24} color="#ffffffff" />
        </Pressable>
        <Pressable onPress={() => deleteTicket(ticket.id)}>
          <Ionicons name="trash-outline" size={24} color="#ffffffff" />
        </Pressable>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}> Ticket Tracker</Text>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TicketItem ticket={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <Pressable style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addText}>＋ Add New Ticket</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingTicket ? 'Edit Ticket' : 'New Ticket'}
            </Text>

            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <View style={styles.statusRow}>
              {(['Created', 'Under Assistance', 'Completed'] as const).map(s => (
                <Pressable key={s} onPress={() => setStatus(s)}>
                  <Text style={[
                    styles.statusOption,
                    status === s && styles.selectedStatus
                  ]}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveTicket}>
                <Text style={styles.save}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000000ff' },
  header: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 , textAlign: 'center'},
  ticket: {
    backgroundColor: '#252525ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  title: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  status: { marginTop: 5, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', marginTop: 10 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusOption: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#eee',
    fontWeight: 'bold',
  },
  selectedStatus: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancel: { color: '#ff0000', fontWeight: 'bold' },
  save: { color: '#007bff', fontWeight: 'bold' },
});
