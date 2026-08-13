export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/lsphw.png">
<span class="cmd-green">
# ================================
# SW1 & SW2 CONFIGURATION 
# ================================
</span>
hostname SW1 / SW2
!
vlan 1173
 name LSP
!
interface GigabitEthernet 0/0
 switchport mode trunk
 switchport trunk allowed vlan only 1173
!
interface GigabitEthernet 0/1
 switchport access vlan 1173
!
<span class="cmd-green">
# ================================
# PE1 CONFIGURATION 
# ================================
</span>
sysname PE1
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 traffic-eng level-2
 network-entity 49.0001.0040.0400.4004.00
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 4.4.4.4 32
 isis enable 1
<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 4.4.4.4

mpls
mpls ldp
mpls l2vpn

bfd

mpls
 mpls te
 mpls te auto-frr
 mpls rsvp-te
 mpls rsvp-te hello
 mpls rsvp-te srefresh
 mpls te cspf
 mpls oam
 mpls bfd enable

mpls ldp remote-peer PE2
 remote-ip 5.5.5.5
<span class="cmd-bold">
# ================================
# EXPLICIT PATH CONFIGURATION
# ================================
</span>
explicit-path PE1_TO_PE2
 next hop 13.13.13.1
 next hop 10.10.10.1
 next hop 11.11.11.2
 next hop 14.14.14.2
<span class="cmd-bold">
# ================================
# MPLS TE TUNNEL CONFIGURATION
# ================================
</span>
interface Tunnel10000
 ip address unnumbered interface LoopBack0
 tunnel-protocol mpls te
 destination 5.5.5.5
 mpls te tunnel-id 1
 mpls te priority 4 4
 mpls te record-route label
 mpls te fast-reroute
 mpls te path explicit-path PE1_TO_PE2

tunnel-policy TP_PE1_TO_PE2
 tunnel binding destination 5.5.5.5 te Tunnel10000 down-switch
<span class="cmd-bold">
# ================================
# VSI / VPLS CONFIGURATION
# ================================
</span>
vsi VPLS1173
 mtu 1530
 pwsignal ldp
  vsi-id 1173
  peer 5.5.5.5 tnl-policy TP_PE1_TO_PE2
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 13.13.13.2 30
 description P2-Ethernet1/0/2
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp
<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1
 description PC 1
 portswitch
 y
 undo shutdown
 port link-type trunk
 undo dcn
 undo dcn mode vlan
<span class="cmd-bold">
# ================================
# SUB-INTERFACE VPLS CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1.1173
 vlan-type dot1q 1173
 l2 binding vsi VPLS1173
<span class="cmd-green">
# ================================
# PE2 CONFIGURATION 
# ================================
</span>
sysname PE2
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 traffic-eng level-2
 network-entity 49.0001.0010.0100.1001.00
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 5.5.5.5 32
 isis enable 1
<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 5.5.5.5

mpls
mpls ldp
mpls l2vpn

bfd

mpls
 mpls te
 mpls te auto-frr
 mpls rsvp-te
 mpls rsvp-te hello
 mpls rsvp-te srefresh
 mpls te cspf
 mpls oam
 mpls bfd enable

mpls ldp remote-peer PE1
 remote-ip 4.4.4.4
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 traffic-eng level-2
 network-entity 49.0001.0050.0500.5005.00
<span class="cmd-bold">
# ================================
# VSI / VPLS CONFIGURATION
# ================================
</span>
vsi VPLS1173
 mtu 1530
 pwsignal ldp
  vsi-id 1173
  peer 4.4.4.4
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 14.14.14.2 30
 description P3-Ethernet1/0/2
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp
<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1
 description PC 2
 portswitch
 y
 undo shutdown
 port link-type trunk
 undo dcn
 undo dcn mode vlan
<span class="cmd-bold">
# ================================
# SUB-INTERFACE VPLS CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1.1173
 vlan-type dot1q 1173
 l2 binding vsi VPLS1173
<span class="cmd-green">
# ================================
# P1 CONFIGURATION 
# ================================
</span>
sysname P1
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 traffic-eng level-2
 network-entity 49.0001.0010.0100.1001.00
<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 1.1.1.1

mpls
mpls ldp
mpls l2vpn

bfd

mpls
 mpls te
 mpls te auto-frr
 mpls rsvp-te
 mpls rsvp-te hello
 mpls rsvp-te srefresh
 mpls te cspf
 mpls oam
 mpls bfd enable
<span class="cmd-bold">
# ================================
# INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 11.11.11.1 30
 description P3-Ethernet1/0/0
 isis enable 1
  mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp

interface Ethernet1/0/1
 ip address 10.10.10.1 30
 description P2-Ethernet1/0/1
 isis enable 1
  mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 1.1.1.1 32
 isis enable 1
<span class="cmd-green">
# ================================
# P2 CONFIGURATION 
# ================================
</span>
sysname P2
<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 2.2.2.2

mpls
mpls ldp
mpls l2vpn

bfd

mpls
 mpls te
 mpls te auto-frr
 mpls rsvp-te
 mpls rsvp-te hello
 mpls rsvp-te srefresh
 mpls te cspf
 mpls oam
 mpls bfd enable
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 traffic-eng level-2
 network-entity 49.0001.0020.0200.2002.00
<span class="cmd-bold">
# ================================
# INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 12.12.12.1 30
 description P3-Ethernet1/0/1
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp

interface Ethernet1/0/1
 ip address 10.10.10.2 30
 description P1-Ethernet1/0/1
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp

interface Ethernet1/0/2
 ip address 13.13.13.1 30
 description PE1-Ethernet1/0/0
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 2.2.2.2 32
 isis enable 1
<span class="cmd-green">
# ================================
# P3 CONFIGURATION 
# ================================
</span>
sysname P3
<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 3.3.3.3

mpls
mpls ldp
mpls l2vpn

bfd

mpls
 mpls te
 mpls te auto-frr
 mpls rsvp-te
 mpls rsvp-te hello
 mpls rsvp-te srefresh
 mpls te cspf
 mpls oam
 mpls bfd enable
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 traffic-eng level-2
 network-entity 49.0001.0030.0300.3003.00
<span class="cmd-bold">
# ================================
# INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 11.11.11.2 30
 description P1-Ethernet1/0/0
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp
  
interface Ethernet1/0/1
 ip address 12.12.12.2 30
 description P2-Ethernet1/0/0
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp

interface Ethernet1/0/2
 ip address 14.14.14.1 30
 description PE2-Ethernet1/0/0
 isis enable 1
 mpls
  mpls te
  mpls rsvp-te
  mpls rsvp-te bfd enable
  mpls rsvp-te hello
  mpls ldp
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 3.3.3.3 32
 isis enable 1
`;