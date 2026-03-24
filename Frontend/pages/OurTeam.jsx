import React from "react";
import SEO from "../components/SEO";

const TEAM_HIERARCHY = {
  owner: {
    name: "A. Founder",
    role: "Founder & Owner",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
  },
  teamLeads: [
    {
      name: "Priya R",
      role: "Operations Lead",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      members: [
        { name: "Kiran", role: "Volunteer Coordinator" },
        { name: "Shreya", role: "Field Support Executive" },
      ],
    },
    {
      name: "Rahul M",
      role: "Blood Drive Lead",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      members: [
        { name: "Akhil", role: "Donor Relations" },
        { name: "Neha", role: "Medical Camp Coordinator" },
      ],
    },
    {
      name: "Sana F",
      role: "Community Outreach Lead",
      photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
      members: [
        { name: "Ravi", role: "Social Media Volunteer" },
        { name: "Asha", role: "Event Organizer" },
      ],
    },
  ],
};

const PersonCard = ({ person, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ${className}`}>
    <div className="flex items-center gap-4">
      <img
        src={person.photo}
        alt={person.name}
        className="w-16 h-16 rounded-full object-cover border border-gray-200"
      />
      <div>
        <h3 className="text-lg font-bold text-[#1A1A1A]">{person.name}</h3>
        <p className="text-sm text-gray-600">{person.role}</p>
      </div>
    </div>
  </div>
);

const OurTeam = () => {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-20">
      <SEO
        title="Our Team | Humanity Calls"
        description="Meet the Humanity Calls team hierarchy and leadership."
      />
      <div className="max-w-none mx-auto px-[5%] space-y-10">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold text-[#1A1A1A]">Our Team</h1>
          <p className="text-gray-600 max-w-3xl">
            Team hierarchy designed similar to corporate structure, from owner to team leads and their members.
          </p>
        </header>

        <section className="space-y-8">
          <div className="max-w-md mx-auto">
            <PersonCard person={TEAM_HIERARCHY.owner} className="border-blood-red/40" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TEAM_HIERARCHY.teamLeads.map((lead) => (
              <div key={lead.name} className="space-y-4">
                <PersonCard person={lead} />
                <div className="space-y-3 pl-4 border-l-2 border-blood-red/30">
                  {lead.members.map((member) => (
                    <div
                      key={`${lead.name}-${member.name}`}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <p className="font-semibold text-[#1A1A1A]">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OurTeam;
