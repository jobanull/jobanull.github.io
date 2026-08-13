export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/l3vpn.png">
<span class="cmd-green">
# ================================
# PE1 CONFIGURATION 
# ================================
</span>
sysname PE1
<span class="cmd-bold">
# ================================
# VPN INSTANCE CONFIGURATION
# ASN:ID 65000:1 & 65000:2
# ================================
</span>
ip vpn-instance CUST-A
 ipv4-family
  route-distinguisher 65000:1
  vpn-target 65000:100 export-extcommunity
  vpn-target 65000:100 import-extcommunity
ip vpn-instance CUST-B
 ipv4-family
  route-distinguisher 65000:2
  vpn-target 65000:200 export-extcommunity
  vpn-target 65000:200 import-extcommunity
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 1.1.1.1
mpls
mpls ldp
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0010.0100.1001.00
<span class="cmd-bold">
# ================================
# BGP CONFIGURATION
# ================================
</span>
bgp 65000
 router-id 1.1.1.1
 peer 3.3.3.3 as-number 65000
 peer 3.3.3.3 connect-interface LoopBack0

 ipv4-family unicast
  peer 3.3.3.3 enable

 ipv4-family vpnv4
  policy vpn-target
  peer 3.3.3.3 enable

 ipv4-family vpn-instance CUST-A
  import-route direct

 ipv4-family vpn-instance CUST-B
  import-route direct
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 1.1.1.1 255.255.255.255
 isis enable 1
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 10.10.10.1 255.255.255.252
 description P1-Ethernet1/0/0
 isis enable 1
 mpls
 mpls ldp
 undo shutdown

interface Ethernet1/0/2
 ip address 12.12.12.1 255.255.255.252
 description PE2-Ethernet1/0/2
 isis enable 1
 mpls
 mpls ldp
 undo shutdown
<span class="cmd-bold">
# ================================
# CE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1
 ip binding vpn-instance CUST-A
 ip address 192.168.1.1 255.255.255.252
 description CE1-Ether1
 undo shutdown
interface Ethernet1/0/3
 ip binding vpn-instance CUST-B
 ip address 192.168.2.1 255.255.255.252
  description CE3-Ether1
 undo shutdown
<span class="cmd-green">
# ================================
# P1 CONFIGURATION 
# ================================
</span>
sysname P1
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 2.2.2.2
mpls
mpls ldp
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0020.0200.2002.00
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 2.2.2.2 255.255.255.255
 isis enable 1
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 10.10.10.2 255.255.255.252
 description PE1-Ethernet1/0/0
 isis enable 1
 mpls
 mpls ldp
 undo shutdown

interface Ethernet1/0/1
 ip address 11.11.11.1 255.255.255.252
 description PE2-Ethernet1/0/0
 isis enable 1
 mpls
 mpls ldp
 undo shutdown
<span class="cmd-green">
# ================================
# PE2 CONFIGURATION 
# ================================
</span>
sysname PE2
<span class="cmd-bold">
# ================================
# VPN INSTANCE CONFIGURATION
# ASN:ID 65000:1 & 65000:2
# ================================
</span>
ip vpn-instance CUST-A
 ipv4-family
  route-distinguisher 65000:1
  vpn-target 65000:100 export-extcommunity
  vpn-target 65000:100 import-extcommunity
ip vpn-instance CUST-B
 ipv4-family
  route-distinguisher 65000:2
  vpn-target 65000:200 export-extcommunity
  vpn-target 65000:200 import-extcommunity
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 3.3.3.3
mpls
mpls ldp
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0030.0300.3003.00
<span class="cmd-bold">
# ================================
# BGP CONFIGURATION
# ================================
</span>
bgp 65000
 router-id 3.3.3.3
 peer 1.1.1.1 as-number 65000
 peer 1.1.1.1 connect-interface LoopBack0
 ipv4-family unicast
  peer 1.1.1.1 enable

 ipv4-family vpnv4
  policy vpn-target
  peer 1.1.1.1 enable

 ipv4-family vpn-instance CUST-A
  import-route direct
 ipv4-family vpn-instance CUST-B
  import-route direct
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 3.3.3.3 255.255.255.255
 isis enable 1
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 11.11.11.2 255.255.255.252
 description P1-Ethernet1/0/1
 isis enable 1
 mpls
 mpls ldp
 undo shutdown

interface Ethernet1/0/2
 ip address 12.12.12.2 255.255.255.252
 description PE1-Ethernet1/0/2
 isis enable 1
 mpls
 mpls ldp
 undo shutdown
<span class="cmd-bold">
# ================================
# CE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1
 ip binding vpn-instance CUST-A
 ip address 192.168.2.1 255.255.255.252
 description CE2-Ether1
 undo shutdown
interface Ethernet1/0/3
 ip binding vpn-instance CUST-B
 description CE4-Ether1
 ip address 192.168.20.1 255.255.255.252
 undo shutdown
<span class="cmd-bold">
# ================================
# CE CONFIGURATION
# ================================
</span>
/ip address
add address=192.168.1.2/30 interface=ether1  => CE1
add address=192.168.2.2/30 interface=ether1  => CE2
add address=192.168.10.2/30 interface=ether1 => CE3
add address=192.168.20.2/30 interface=ether1 => CE4
/ip route
add dst-address=0.0.0.0/0 gateway=192.168.1.1  => CE1
add dst-address=0.0.0.0/0 gateway=192.168.2.1  => CE2
add dst-address=0.0.0.0/0 gateway=192.168.10.1 => CE3
add dst-address=0.0.0.0/0 gateway=192.168.20.1 => CE3
<span class="cmd-bold">
</pre>
`;