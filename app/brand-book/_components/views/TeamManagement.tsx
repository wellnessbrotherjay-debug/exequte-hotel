
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { TeamMember, TeamRole } from '../types';
import { Users, Shield, Plus, MoreHorizontal, Check, X, Search, Mail, Trash2, Edit2, Layout, Database } from 'lucide-react';

export const TeamManagement: React.FC = () => {
    const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, projects, updateProject } = useAppStore();
    const [activeTab, setActiveTab] = useState<'members' | 'access'>('members');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    // Form State
    const [newMember, setNewMember] = useState<Partial<TeamMember>>({
        name: '',
        email: '',
        role: 'Marketing',
        status: 'active'
    });

    const handleSaveMember = () => {
        if (!newMember.name || !newMember.email) return alert("Name and Email required");

        if (editingMember) {
            updateTeamMember(editingMember.id, newMember);
            setEditingMember(null);
        } else {
            addTeamMember({
                id: crypto.randomUUID(),
                avatar_url: `https://ui-avatars.com/api/?name=${newMember.name}&background=random`,
                ...newMember as TeamMember
            });
        }
        setIsAddModalOpen(false);
        setNewMember({ name: '', email: '', role: 'Marketing', status: 'active' });
    };

    const handleEditClick = (member: TeamMember) => {
        setEditingMember(member);
        setNewMember(member);
        setIsAddModalOpen(true);
    };

    const toggleProjectAccess = (projectId: string, memberId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const currentMembers = project.members || [];
        const newMembers = currentMembers.includes(memberId)
            ? currentMembers.filter(id => id !== memberId)
            : [...currentMembers, memberId];

        updateProject(projectId, { members: newMembers });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-serif-brand">Team & Access</h1>
                    <p className="opacity-60">Manage your organization&apos;s members and project permissions.</p>
                </div>
                <button
                    onClick={() => { setEditingMember(null); setNewMember({ role: 'Marketing', status: 'active' }); setIsAddModalOpen(true); }}
                    className="bg-black text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 flex items-center gap-2"
                >
                    <Plus size={18} /> Invite Member
                </button>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'members' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                >
                    <Users size={16} /> Members
                </button>
                <button
                    onClick={() => setActiveTab('access')}
                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'access' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                >
                    <Shield size={16} /> Access Matrix
                </button>
            </div>

            {/* MEMBERS VIEW */}
            {activeTab === 'members' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teamMembers.map(member => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={member.avatar_url} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                            <div>
                                                <p className="font-bold text-gray-900">{member.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} /> {member.email || 'No email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                        ${member.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                member.role === 'Design' ? 'bg-pink-100 text-pink-700' :
                                                    member.role === 'Marketing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                                    `}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-2 text-sm font-medium ${member.status === 'active' ? 'text-green-600' : 'text-orange-500'}`}>
                                            <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                            {member.status === 'active' ? 'Active' : 'Invited'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEditClick(member)} className="p-2 hover:bg-gray-200 rounded text-gray-500 hover:text-black"><Edit2 size={16} /></button>
                                            <button onClick={() => deleteTeamMember(member.id)} className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ACCESS MATRIX VIEW */}
            {activeTab === 'access' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-bold text-gray-700">Project Permissions</h3>
                        <p className="text-xs text-gray-500 mt-1">Control who can view and edit specific campaigns.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4 w-64">Project / Campaign</th>
                                    {teamMembers.map(m => (
                                        <th key={m.id} className="px-4 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1" title={m.name}>
                                                <img src={m.avatar_url} className="w-8 h-8 rounded-full bg-gray-200" />
                                                <span className="text-[10px] truncate w-16">{m.name.split(' ')[0]}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {projects.map(project => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{project.icon || '📁'}</span>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{project.name}</p>
                                                    <p className="text-xs text-gray-400 truncate w-48">{project.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {teamMembers.map(m => {
                                            const hasAccess = project.members?.includes(m.id);
                                            return (
                                                <td key={m.id} className="px-4 py-4 text-center">
                                                    <div
                                                        onClick={() => toggleProjectAccess(project.id, m.id)}
                                                        className={`w-6 h-6 mx-auto rounded border flex items-center justify-center cursor-pointer transition-all ${hasAccess ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-50 border-gray-300 text-transparent hover:border-gray-400'}`}
                                                    >
                                                        <Check size={14} />
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-[500px] rounded-xl shadow-2xl p-8">
                        <h2 className="text-xl font-bold mb-6">{editingMember ? 'Edit Member' : 'Invite New Member'}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Full Name</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                                    placeholder="e.g. Jane Doe"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Email Address</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                                    placeholder="jane@company.com"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Marketing', 'Design', 'Creative', 'Admin'].map(role => (
                                        <button
                                            key={role}
                                            onClick={() => setNewMember({ ...newMember, role: role as TeamRole })}
                                            className={`py-2 text-sm font-bold rounded-lg border transition-all ${newMember.role === role ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Status</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-white"
                                    value={newMember.status}
                                    onChange={(e) => setNewMember({ ...newMember, status: e.target.value as any })}
                                >
                                    <option value="active">Active</option>
                                    <option value="invited">Invited (Pending)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black">Cancel</button>
                            <button onClick={handleSaveMember} className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90">
                                {editingMember ? 'Save Changes' : 'Send Invite'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
