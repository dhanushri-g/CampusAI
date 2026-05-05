import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Plus, Search, Trash2, BookOpen, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export function MaterialsPage() {
  const { profile } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', subject: '', content: '', type: 'notes' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewMaterial(prev => ({ ...prev, title: file.name.split('.')[0] }));
      
      // If it's a text file, we can read it directly for AI grounding
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setNewMaterial(prev => ({ ...prev, content: e.target?.result as string }));
        };
        reader.readAsText(file);
      } else {
        // For other files, we'll prompt for manual summary
        setNewMaterial(prev => ({ ...prev, content: `[Indexed File: ${file.name}]` }));
      }
    }
  };

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const q = query(collection(db, 'materials'));
        const snap = await getDocs(q);
        setMaterials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setUploadProgress(20);
    try {
      setUploadProgress(60);
      const docRef = await addDoc(collection(db, 'materials'), {
        ...newMaterial,
        subjectName: newMaterial.subject,
        fileMetadata: selectedFile ? {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        } : null,
        uploadedBy: profile.uid,
        createdAt: serverTimestamp()
      });
      setUploadProgress(100);
      setTimeout(() => {
        setMaterials(prev => [...prev, { id: docRef.id, ...newMaterial, subjectName: newMaterial.subject }]);
        setIsAdding(false);
        setNewMaterial({ title: '', subject: '', content: '', type: 'notes' });
        setSelectedFile(null);
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      console.error("Error adding material:", err);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'materials', id));
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Error deleting material:", err);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Course Materials 📚
          </h2>
          <p className="text-zinc-400 mt-2">Manage grounding data for CampusAI Intelligence.</p>
        </div>
        {profile?.role === 'faculty' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Material
          </button>
        )}
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search materials or subjects..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-violet-500/50 transition-all"
        />
      </div>

      {isAdding && (
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6"
         >
           <h3 className="text-xl font-bold flex items-center gap-2">
             <BookOpen className="w-5 h-5 text-violet-400" />
             New Academic Material
           </h3>
           <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="w-full p-8 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-violet-500/50 transition-all bg-white/5 group relative">
                   <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept=".pdf,.txt,.doc,.docx,.ppt,.pptx"
                   />
                   <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
                      <div className="p-4 bg-violet-600/10 rounded-2xl text-violet-400 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-white">
                        {selectedFile ? selectedFile.name : 'Click or Drag to Upload Material'}
                      </p>
                      <p className="text-zinc-500 text-xs">PDF, DOC, TXT (Max 10MB)</p>
                   </div>
                </div>
                {uploadProgress > 0 && (
                  <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Title</label>
                <input 
                  required
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-violet-500"
                  placeholder="e.g. Unit 1: Introduction to Data Structures"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Subject</label>
                <input 
                  required
                  value={newMaterial.subject}
                  onChange={e => setNewMaterial({...newMaterial, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-violet-500"
                  placeholder="e.g. Algorithms"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Content (for AI Grounding)</label>
                <textarea 
                  required
                  rows={4}
                  value={newMaterial.content}
                  onChange={e => setNewMaterial({...newMaterial, content: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-violet-500 resize-none"
                  placeholder="Paste core notes or summary here. CampusAI will use this to answer student queries."
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-violet-600 rounded-xl font-bold hover:bg-violet-500 transition-all"
                >
                  Save Material
                </button>
              </div>
           </form>
         </motion.div>
      )}

      {loading ? (
        <div className="h-60 flex items-center justify-center">
           <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => (
            <motion.div 
              key={mat.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-3xl group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-3xl -mr-12 -mt-12" />
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-violet-600/20 rounded-2xl uppercase text-[10px] font-black text-violet-400">
                   {mat.type}
                 </div>
                 {profile?.uid === mat.uploadedBy && (
                   <button 
                    onClick={() => handleDelete(mat.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
              </div>
              <h4 className="text-lg font-bold mb-1 truncate">{mat.title}</h4>
              <p className="text-zinc-500 text-sm mb-4 font-medium">{mat.subjectName}</p>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   AI Indexed
                </div>
                <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-zinc-400">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {filteredMaterials.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
               <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-zinc-500 font-bold">No Materials Found</h3>
               <p className="text-zinc-600 text-sm mt-1">Grounding knowledge base is currently empty.</p>
            </div>
          )}
        </div>
      )}

      {/* AI Grounding Stats */}
      <div className="bg-violet-600/10 border border-violet-500/20 rounded-[2.5rem] p-8 flex items-center justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-3xl -mr-32 -mt-32" />
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
               <Sparkles className="w-6 h-6 text-violet-400" />
               <h3 className="text-xl font-bold">Intelligence Status</h3>
            </div>
            <p className="text-zinc-400 max-w-lg">
              CampusAI is currently processing <b>{materials.length} academic materials</b> for this semester. 
              Knowledge grounding is active and available for all students in your department.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-8 relative z-10">
             <div className="text-center">
                <p className="text-3xl font-black text-white">{materials.length}</p>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Materials</p>
             </div>
             <div className="text-center">
                <p className="text-3xl font-black text-emerald-500">Active</p>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Grounding</p>
             </div>
          </div>
      </div>
    </div>
  );
}
